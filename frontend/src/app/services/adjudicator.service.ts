import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

// ========================================
// INTERFACES
// ========================================

export interface CaseInfo {
  case_number: string;
  visa_type: string;
  petitioner_name: string;
  beneficiary_name: string;
  job_title?: string;
  job_duties?: string;
  degree_type?: string;
  degree_field?: string;
  years_experience?: number;
  work_location?: string;
  offered_wage?: number;
  prevailing_wage?: number;
  lca_number?: string;
}

export interface AdjudicationEvent {
  event_type: 'stage' | 'reasoning' | 'tool_call' | 'tool_result' | 'error' | 'complete';
  stage?: string;
  content?: string;
  tool_name?: string;
  tool_result?: Record<string, unknown>;
  confidence?: number;
  timestamp: string;
}

export interface ReasoningStep {
  id: string;
  type: 'evaluating' | 'evidence' | 'policy' | 'assessment' | 'tool';
  content: string;
  timestamp: string;
  toolName?: string;
  toolResult?: Record<string, unknown>;
  confidence?: number;
}

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  status: 'completed' | 'in-progress' | 'pending';
  confidence?: number;
}

export type ProcessingStage = 'form_validation' | 'evidence_review' | 'policy_matching' | 'risk_assessment' | 'draft_generation';

// ========================================
// SERVICE
// ========================================

@Injectable({
  providedIn: 'root'
})
export class AdjudicatorService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8000';
  
  // Reactive state using signals
  private _isProcessing = signal(false);
  private _currentStage = signal<ProcessingStage>('form_validation');
  private _reasoningSteps = signal<ReasoningStep[]>([]);
  private _criteria = signal<Criterion[]>([]);
  private _error = signal<string | null>(null);
  private _confidence = signal(0);
  private _elapsedTime = signal(0);
  private _analysisResult = signal<string>('');
  
  // Public readonly signals
  readonly isProcessing = this._isProcessing.asReadonly();
  readonly currentStage = this._currentStage.asReadonly();
  readonly reasoningSteps = this._reasoningSteps.asReadonly();
  readonly criteria = this._criteria.asReadonly();
  readonly error = this._error.asReadonly();
  readonly confidence = this._confidence.asReadonly();
  readonly elapsedTime = this._elapsedTime.asReadonly();
  readonly analysisResult = this._analysisResult.asReadonly();
  
  // Computed values
  readonly currentStageIndex = computed(() => {
    const stages: ProcessingStage[] = ['form_validation', 'evidence_review', 'policy_matching', 'risk_assessment', 'draft_generation'];
    return stages.indexOf(this._currentStage());
  });
  
  readonly formattedElapsedTime = computed(() => {
    const seconds = this._elapsedTime();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  private eventSource: EventSource | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private stepCounter = 0;

  // ========================================
  // STREAMING ANALYSIS
  // ========================================

  async analyzeCase(caseInfo: CaseInfo): Promise<void> {
    this.reset();
    this._isProcessing.set(true);
    this.startTimer();
    
    // Initialize criteria based on visa type
    await this.loadCriteria(caseInfo.visa_type);
    
    try {
      const response = await fetch(`${this.apiUrl}/api/adjudicator/analyze/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case_info: caseInfo,
          user_id: `user_${Date.now()}`,
          session_id: `session_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr.trim()) {
              try {
                const event: AdjudicationEvent = JSON.parse(jsonStr);
                this.handleEvent(event);
              } catch (e) {
                console.error('Failed to parse event:', e);
              }
            }
          }
        }
      }
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Unknown error');
      this._isProcessing.set(false);
      this.stopTimer();
    }
  }

  // ========================================
  // WEBSOCKET ANALYSIS
  // ========================================

  connectWebSocket(userId: string, sessionId: string): WebSocket {
    const ws = new WebSocket(`${this.apiUrl.replace('http', 'ws')}/api/adjudicator/ws/${userId}/${sessionId}`);
    
    ws.onmessage = (event) => {
      const data: AdjudicationEvent = JSON.parse(event.data);
      this.handleEvent(data);
    };
    
    ws.onerror = (error) => {
      this._error.set('WebSocket error');
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      this._isProcessing.set(false);
      this.stopTimer();
    };
    
    return ws;
  }

  // ========================================
  // EVENT HANDLING
  // ========================================

  private handleEvent(event: AdjudicationEvent): void {
    switch (event.event_type) {
      case 'stage':
        this.handleStageEvent(event);
        break;
      case 'tool_call':
        this.handleToolCallEvent(event);
        break;
      case 'tool_result':
        this.handleToolResultEvent(event);
        break;
      case 'reasoning':
        this.handleReasoningEvent(event);
        break;
      case 'complete':
        this.handleCompleteEvent(event);
        break;
      case 'error':
        this._error.set(event.content || 'Unknown error');
        this._isProcessing.set(false);
        this.stopTimer();
        break;
    }
  }

  private handleStageEvent(event: AdjudicationEvent): void {
    if (event.stage) {
      this._currentStage.set(event.stage as ProcessingStage);
      
      // Add reasoning step for stage change
      this.addReasoningStep({
        type: 'evaluating',
        content: event.content || `Starting ${event.stage.replace('_', ' ')}...`,
        timestamp: event.timestamp
      });
    }
  }

  private handleToolCallEvent(event: AdjudicationEvent): void {
    const toolName = event.tool_name || 'unknown';
    
    // Update criteria status based on tool
    this.updateCriteriaFromTool(toolName, 'in-progress');
    
    // Add reasoning step
    this.addReasoningStep({
      type: 'tool',
      content: `Executing: ${this.formatToolName(toolName)}`,
      toolName: toolName,
      timestamp: event.timestamp
    });
  }

  private handleToolResultEvent(event: AdjudicationEvent): void {
    const toolName = event.tool_name || 'unknown';
    const result = event.tool_result;
    
    // Update criteria status
    this.updateCriteriaFromTool(toolName, 'completed', result);
    
    // Add evidence step
    if (result) {
      const confidence = (result as Record<string, unknown>)['confidence_score'] as number || 
                        (result as Record<string, unknown>)['confidence'] as number;
      
      this.addReasoningStep({
        type: 'evidence',
        content: this.formatToolResult(toolName, result),
        toolName: toolName,
        toolResult: result,
        confidence: confidence,
        timestamp: event.timestamp
      });
      
      // Add policy reference if available
      const policyRef = (result as Record<string, unknown>)['policy_reference'] as string ||
                       (result as Record<string, unknown>)['legal_standard'] as string;
      if (policyRef) {
        this.addReasoningStep({
          type: 'policy',
          content: `Policy reference: ${policyRef}`,
          timestamp: event.timestamp
        });
      }
      
      // Add assessment
      const determination = (result as Record<string, unknown>)['overall_determination'] as string ||
                           (result as Record<string, unknown>)['determination'] as string ||
                           (result as Record<string, unknown>)['overall_status'] as string ||
                           (result as Record<string, unknown>)['overall_qualification'] as string;
      if (determination) {
        this.addReasoningStep({
          type: 'assessment',
          content: `Assessment: ${determination}`,
          confidence: confidence,
          timestamp: event.timestamp
        });
      }
    }
  }

  private handleReasoningEvent(event: AdjudicationEvent): void {
    if (event.content) {
      this._analysisResult.update(current => current + event.content);
    }
  }

  private handleCompleteEvent(event: AdjudicationEvent): void {
    this._isProcessing.set(false);
    this._confidence.set(event.confidence || 0);
    this._currentStage.set('draft_generation');
    this.stopTimer();
    
    // Mark all criteria as completed
    this._criteria.update(criteria => 
      criteria.map(c => ({ ...c, status: 'completed' as const }))
    );
    
    this.addReasoningStep({
      type: 'assessment',
      content: event.content || 'Analysis complete',
      confidence: event.confidence,
      timestamp: event.timestamp
    });
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private addReasoningStep(step: Omit<ReasoningStep, 'id'>): void {
    this.stepCounter++;
    this._reasoningSteps.update(steps => [
      ...steps,
      { ...step, id: `step_${this.stepCounter}` }
    ]);
  }

  private updateCriteriaFromTool(toolName: string, status: 'in-progress' | 'completed', result?: Record<string, unknown>): void {
    const toolToCriteria: Record<string, string> = {
      'analyze_petition_form': '1',
      'evaluate_specialty_occupation': '1',
      'check_beneficiary_qualifications': '2',
      'verify_employer_employee_relationship': '3',
      'check_lca_compliance': '4',
      'generate_adjudication_draft': '6'
    };
    
    const criterionId = toolToCriteria[toolName];
    if (criterionId) {
      this._criteria.update(criteria =>
        criteria.map(c => {
          if (c.id === criterionId) {
            const confidence = result ? 
              ((result as Record<string, unknown>)['confidence_score'] as number || 
               (result as Record<string, unknown>)['confidence'] as number) : undefined;
            return { ...c, status, confidence };
          }
          return c;
        })
      );
    }
  }

  private formatToolName(toolName: string): string {
    return toolName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatToolResult(toolName: string, result: Record<string, unknown>): string {
    switch (toolName) {
      case 'analyze_petition_form':
        return `Form validation: ${result['validation_status']} (${result['completeness_score']}% complete)`;
      case 'evaluate_specialty_occupation':
        return `Specialty occupation: ${result['overall_determination']} (${result['confidence_score']}% confidence)`;
      case 'check_beneficiary_qualifications':
        return `Beneficiary qualifications: ${result['overall_qualification']} (${result['confidence_score']}% confidence)`;
      case 'verify_employer_employee_relationship':
        return `Employer-employee relationship: ${result['determination']} (${result['confidence_score']}% confidence)`;
      case 'check_lca_compliance':
        return `LCA compliance: ${result['overall_status']} (${result['confidence_score']}% confidence)`;
      case 'generate_adjudication_draft':
        return `Draft recommendation: ${(result['draft_decision'] as Record<string, unknown>)?.['summary'] || result['recommendation']}`;
      default:
        return JSON.stringify(result);
    }
  }

  async loadCriteria(visaType: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/adjudicator/criteria/${visaType}`);
      if (response.ok) {
        const data = await response.json();
        this._criteria.set(
          data.criteria.map((c: { id: string; name: string; description?: string }) => ({
            ...c,
            status: 'pending' as const
          }))
        );
      } else {
        // Default H-1B criteria
        this._criteria.set([
          { id: '1', name: 'Specialty Occupation', status: 'pending' },
          { id: '2', name: 'Beneficiary Qualifications', status: 'pending' },
          { id: '3', name: 'Employer-Employee Relationship', status: 'pending' },
          { id: '4', name: 'LCA Compliance', status: 'pending' },
          { id: '5', name: 'Prevailing Wage', status: 'pending' },
          { id: '6', name: 'Draft Generation', status: 'pending' }
        ]);
      }
    } catch {
      // Use default criteria on error
      this._criteria.set([
        { id: '1', name: 'Specialty Occupation', status: 'pending' },
        { id: '2', name: 'Beneficiary Qualifications', status: 'pending' },
        { id: '3', name: 'Employer-Employee Relationship', status: 'pending' },
        { id: '4', name: 'LCA Compliance', status: 'pending' },
        { id: '5', name: 'Prevailing Wage', status: 'pending' },
        { id: '6', name: 'Draft Generation', status: 'pending' }
      ]);
    }
  }

  private startTimer(): void {
    this._elapsedTime.set(0);
    this.timerInterval = setInterval(() => {
      this._elapsedTime.update(t => t + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  reset(): void {
    this.stopTimer();
    this._isProcessing.set(false);
    this._currentStage.set('form_validation');
    this._reasoningSteps.set([]);
    this._error.set(null);
    this._confidence.set(0);
    this._elapsedTime.set(0);
    this._analysisResult.set('');
    this.stepCounter = 0;
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Pause/Resume functionality
  pause(): void {
    this.stopTimer();
    // Note: Actual pause of backend processing would require WebSocket control
  }

  resume(): void {
    if (this._isProcessing()) {
      this.startTimer();
    }
  }
}
