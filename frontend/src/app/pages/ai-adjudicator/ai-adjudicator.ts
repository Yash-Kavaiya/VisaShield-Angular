import { Component, signal, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  FileText, Brain, Play, Pause, SkipForward, CheckCircle, Clock, Circle, 
  AlertTriangle, ChevronRight, ZoomIn, ZoomOut, ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, Upload, RefreshCw, Settings, Download
} from 'lucide-angular';
import { AdjudicatorService, CaseInfo, ReasoningStep, Criterion, ProcessingStage } from '../../services/adjudicator.service';

@Component({
  selector: 'app-ai-adjudicator',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './ai-adjudicator.html',
  styleUrl: './ai-adjudicator.scss'
})
export class AiAdjudicator implements OnDestroy {
  private adjudicatorService = inject(AdjudicatorService);

  readonly icons = {
    fileText: FileText,
    brain: Brain,
    play: Play,
    pause: Pause,
    skipForward: SkipForward,
    checkCircle: CheckCircle,
    clock: Clock,
    circle: Circle,
    alertTriangle: AlertTriangle,
    chevronRight: ChevronRight,
    zoomIn: ZoomIn,
    zoomOut: ZoomOut,
    chevronLeft: ChevronLeftIcon,
    chevronRightIcon: ChevronRightIcon,
    upload: Upload,
    refreshCw: RefreshCw,
    settings: Settings,
    download: Download
  };

  // Service state bindings
  readonly isProcessing = this.adjudicatorService.isProcessing;
  readonly currentStage = this.adjudicatorService.currentStage;
  readonly reasoningSteps = this.adjudicatorService.reasoningSteps;
  readonly criteria = this.adjudicatorService.criteria;
  readonly error = this.adjudicatorService.error;
  readonly confidence = this.adjudicatorService.confidence;
  readonly elapsedTime = this.adjudicatorService.formattedElapsedTime;
  readonly analysisResult = this.adjudicatorService.analysisResult;

  // Local UI state
  showCaseForm = signal(false);
  isPaused = signal(false);
  currentPage = signal(1);
  totalPages = signal(12);
  zoomLevel = signal(100);

  // Current case being processed
  currentCase = signal<CaseInfo>({
    case_number: 'H1B-2024-00847',
    visa_type: 'H-1B',
    petitioner_name: 'TechCorp Solutions Inc.',
    beneficiary_name: 'John Davidson',
    job_title: 'Senior Software Engineer',
    job_duties: 'Design, develop, and maintain enterprise software applications using modern technologies',
    degree_type: "Bachelor's",
    degree_field: 'Computer Science',
    years_experience: 5,
    work_location: 'San Francisco, CA',
    offered_wage: 145000,
    prevailing_wage: 120000,
    lca_number: 'I-200-24001-123456'
  });

  // Processing stages
  readonly stages = [
    { id: 'form_validation', name: 'Form Validation' },
    { id: 'evidence_review', name: 'Evidence Review' },
    { id: 'policy_matching', name: 'Policy Matching' },
    { id: 'risk_assessment', name: 'Risk Assessment' },
    { id: 'draft_generation', name: 'Draft Generation' }
  ];

  // Computed stage index
  readonly currentStageIndex = computed(() => {
    const stageIds = this.stages.map(s => s.id);
    return stageIds.indexOf(this.currentStage());
  });

  // Estimated remaining time (mock calculation)
  readonly estimatedRemaining = computed(() => {
    const elapsed = this.adjudicatorService.elapsedTime();
    const stageIndex = this.currentStageIndex();
    const totalStages = this.stages.length;
    
    if (stageIndex === 0 || elapsed === 0) return '~3:00';
    
    const avgTimePerStage = elapsed / (stageIndex + 1);
    const remainingStages = totalStages - stageIndex - 1;
    const remaining = Math.round(avgTimePerStage * remainingStages);
    
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `~${mins}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnDestroy(): void {
    this.adjudicatorService.reset();
  }

  // ========================================
  // ANALYSIS CONTROLS
  // ========================================

  async startAnalysis(): Promise<void> {
    this.showCaseForm.set(false);
    await this.adjudicatorService.analyzeCase(this.currentCase());
  }

  toggleProcessing(): void {
    if (this.isPaused()) {
      this.adjudicatorService.resume();
      this.isPaused.set(false);
    } else {
      this.adjudicatorService.pause();
      this.isPaused.set(true);
    }
  }

  resetAnalysis(): void {
    this.adjudicatorService.reset();
    this.isPaused.set(false);
  }

  skipToSummary(): void {
    // This would require backend support for skipping
    console.log('Skip to summary requested');
  }

  openCaseForm(): void {
    this.showCaseForm.set(true);
  }

  closeCaseForm(): void {
    this.showCaseForm.set(false);
  }

  updateCaseField(field: keyof CaseInfo, value: string | number): void {
    this.currentCase.update(c => ({ ...c, [field]: value }));
  }

  // ========================================
  // STAGE & CRITERIA HELPERS
  // ========================================

  getStageStatus(stageId: string): 'completed' | 'in-progress' | 'pending' {
    const stageIndex = this.stages.findIndex(s => s.id === stageId);
    const currentIndex = this.currentStageIndex();
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'in-progress';
    return 'pending';
  }

  getStageIcon(status: string) {
    switch (status) {
      case 'completed': return this.icons.checkCircle;
      case 'in-progress': return this.icons.clock;
      default: return this.icons.circle;
    }
  }

  getCriterionIcon(status: string) {
    switch (status) {
      case 'completed': return this.icons.checkCircle;
      case 'in-progress': return this.icons.clock;
      default: return this.icons.circle;
    }
  }

  getReasoningTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'evaluating': 'EVALUATING',
      'evidence': 'EVIDENCE FOUND',
      'policy': 'POLICY REFERENCE',
      'assessment': 'ASSESSMENT',
      'tool': 'TOOL EXECUTION'
    };
    return labels[type] || type.toUpperCase();
  }

  getReasoningTypeClass(type: string): string {
    return `step-${type}`;
  }

  // ========================================
  // DOCUMENT VIEWER CONTROLS
  // ========================================

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  zoomIn(): void {
    if (this.zoomLevel() < 200) {
      this.zoomLevel.update(z => z + 25);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel() > 50) {
      this.zoomLevel.update(z => z - 25);
    }
  }

  // ========================================
  // EXPORT & DOWNLOAD
  // ========================================

  downloadReport(): void {
    const report = {
      case: this.currentCase(),
      analysis: this.analysisResult(),
      confidence: this.confidence(),
      steps: this.reasoningSteps(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adjudication-${this.currentCase().case_number}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
