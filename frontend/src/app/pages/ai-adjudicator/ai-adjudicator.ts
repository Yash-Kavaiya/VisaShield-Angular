import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, FileText, Brain, Play, Pause, SkipForward, CheckCircle, Clock, Circle, AlertTriangle, ChevronRight, ZoomIn, ZoomOut, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-angular';

interface Criterion {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  confidence?: number;
}

interface ReasoningStep {
  id: string;
  type: 'evaluating' | 'evidence' | 'policy' | 'assessment';
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-ai-adjudicator',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './ai-adjudicator.html',
  styleUrl: './ai-adjudicator.scss'
})
export class AiAdjudicator {
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
    chevronRightIcon: ChevronRightIcon
  };

  // Processing state
  isProcessing = signal(true);
  currentStage = signal(2); // 0-4 stages
  elapsedTime = signal('2:34');
  estimatedRemaining = signal('1:45');

  // Current case being processed
  currentCase = {
    caseNumber: 'H1B-2024-00847',
    visaType: 'H-1B',
    applicant: 'John Davidson',
    currentDocument: 'I-129 Petition Form'
  };

  // Processing stages
  stages = [
    { id: 0, name: 'Form Validation', status: 'completed' },
    { id: 1, name: 'Evidence Review', status: 'completed' },
    { id: 2, name: 'Policy Matching', status: 'in-progress' },
    { id: 3, name: 'Risk Assessment', status: 'pending' },
    { id: 4, name: 'Draft Generation', status: 'pending' }
  ];

  // Criteria checklist
  criteria: Criterion[] = [
    { id: '1', name: 'Specialty Occupation', status: 'completed', confidence: 95 },
    { id: '2', name: 'Beneficiary Qualifications', status: 'completed', confidence: 89 },
    { id: '3', name: 'Employer-Employee Relationship', status: 'in-progress' },
    { id: '4', name: 'Prevailing Wage Compliance', status: 'pending' },
    { id: '5', name: 'LCA Compliance', status: 'pending' },
    { id: '6', name: 'Itinerary Requirements', status: 'pending' }
  ];

  // Live reasoning steps
  reasoningSteps: ReasoningStep[] = [
    { id: '1', type: 'evaluating', content: 'Currently evaluating: Employer-Employee Relationship', timestamp: '00:00:05' },
    { id: '2', type: 'evidence', content: 'Evidence found: "The beneficiary will work under the direct supervision of the Engineering Director at TechCorp Solutions headquarters in San Francisco..."', timestamp: '00:00:12' },
    { id: '3', type: 'policy', content: 'Policy reference: USCIS Policy Manual Vol. 2, Part B, Chapter 2.1 - Employer-Employee Relationship Definition', timestamp: '00:00:18' },
    { id: '4', type: 'assessment', content: 'Preliminary assessment: PASS - Clear supervisory chain established with right-to-control factors satisfied', timestamp: '00:00:25' }
  ];

  // Document viewer state
  currentPage = signal(1);
  totalPages = signal(12);
  zoomLevel = signal(100);

  toggleProcessing() {
    this.isProcessing.update(v => !v);
  }

  skipToSummary() {
    this.currentStage.set(4);
  }

  getStageStatus(stageId: number): string {
    if (stageId < this.currentStage()) return 'completed';
    if (stageId === this.currentStage()) return 'in-progress';
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
      'assessment': 'ASSESSMENT'
    };
    return labels[type] || type.toUpperCase();
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  zoomIn() {
    if (this.zoomLevel() < 200) {
      this.zoomLevel.update(z => z + 25);
    }
  }

  zoomOut() {
    if (this.zoomLevel() > 50) {
      this.zoomLevel.update(z => z - 25);
    }
  }
}
