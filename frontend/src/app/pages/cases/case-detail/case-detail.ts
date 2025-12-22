import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Brain, Download, UserPlus, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Calendar, MapPin, Building2, User, Phone, Mail, Copy, Eye, EyeOff, ChevronRight, ExternalLink, Paperclip } from 'lucide-angular';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Verified' | 'Pending Review' | 'Missing';
  uploadedAt: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './case-detail.html',
  styleUrl: './case-detail.scss'
})
export class CaseDetail {
  readonly icons = {
    arrowLeft: ArrowLeft,
    brain: Brain,
    download: Download,
    userPlus: UserPlus,
    checkCircle: CheckCircle,
    xCircle: XCircle,
    clock: Clock,
    alertTriangle: AlertTriangle,
    fileText: FileText,
    calendar: Calendar,
    mapPin: MapPin,
    building: Building2,
    user: User,
    phone: Phone,
    mail: Mail,
    copy: Copy,
    eye: Eye,
    eyeOff: EyeOff,
    chevronRight: ChevronRight,
    externalLink: ExternalLink,
    paperclip: Paperclip
  };

  // Active tab
  activeTab = signal<'overview' | 'documents' | 'ai-analysis' | 'timeline' | 'notes'>('overview');

  // Redaction toggle
  showSensitiveData = signal(false);

  // Mock case data
  caseData = {
    id: '1',
    caseNumber: 'H1B-2024-00847',
    status: 'Processing',
    visaType: 'H-1B',
    filedDate: 'December 15, 2024',
    priorityDate: 'December 16, 2024',
    confidence: 87,
    recommendation: 'LIKELY APPROVABLE',
    applicant: {
      name: 'John Michael Davidson',
      dob: 'March 15, 1990',
      country: 'United Kingdom',
      aNumber: 'A123456789',
      passportNumber: 'GB1234567890',
      currentStatus: 'F-1 Student',
      previousVisas: ['F-1 (2018)', 'B-2 (2016)'],
      email: 'john.davidson@email.com',
      phone: '+1 (555) 123-4567'
    },
    petition: {
      employer: 'TechCorp Solutions Inc.',
      employerAddress: '123 Innovation Drive, San Francisco, CA 94105',
      jobTitle: 'Senior Software Engineer',
      socCode: '15-1252.00',
      wageLevel: 'Level 3 - $145,000/year',
      location: 'San Francisco, CA',
      startDate: 'April 1, 2025'
    },
    team: {
      attorney: { name: 'Sarah Chen', email: 'sarah.chen@lawfirm.com' },
      paralegal: { name: 'James Wilson', email: 'james.wilson@lawfirm.com' }
    }
  };

  documents: Document[] = [
    { id: '1', name: 'I-129 Petition Form', type: 'Form', status: 'Verified', uploadedAt: '2024-12-15' },
    { id: '2', name: 'Labor Condition Application', type: 'Form', status: 'Verified', uploadedAt: '2024-12-15' },
    { id: '3', name: 'Degree Evaluation Report', type: 'Evidence', status: 'Pending Review', uploadedAt: '2024-12-14' },
    { id: '4', name: 'Passport Copy', type: 'Identity', status: 'Missing', uploadedAt: '' },
    { id: '5', name: 'Employment Verification Letter', type: 'Evidence', status: 'Verified', uploadedAt: '2024-12-13' },
    { id: '6', name: 'Resume/CV', type: 'Evidence', status: 'Verified', uploadedAt: '2024-12-13' }
  ];

  timeline: TimelineEvent[] = [
    { id: '1', title: 'Petition Filed', description: 'Initial petition submitted to USCIS', date: 'Dec 15, 2024', status: 'completed' },
    { id: '2', title: 'Receipt Notice', description: 'USCIS confirmed receipt of application', date: 'Dec 16, 2024', status: 'completed' },
    { id: '3', title: 'AI Review Started', description: 'Automated analysis in progress', date: 'Dec 17, 2024', status: 'current' },
    { id: '4', title: 'Human Review', description: 'Attorney review pending', date: 'Pending', status: 'pending' },
    { id: '5', title: 'Decision', description: 'Final determination', date: 'Pending', status: 'pending' }
  ];

  aiFindings = [
    { criterion: 'Specialty Occupation', status: 'pass', confidence: 95, note: 'Position requires specialized knowledge in software engineering' },
    { criterion: 'Beneficiary Qualifications', status: 'pass', confidence: 89, note: 'Bachelor\'s degree in Computer Science from accredited university' },
    { criterion: 'Employer-Employee Relationship', status: 'pass', confidence: 92, note: 'Clear supervisory relationship established' },
    { criterion: 'Prevailing Wage Compliance', status: 'warning', confidence: 78, note: 'Wage level 3 appropriate but recommend verification' }
  ];

  tabs: { id: 'overview' | 'documents' | 'ai-analysis' | 'timeline' | 'notes', label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'ai-analysis', label: 'AI Analysis' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'notes', label: 'Notes' }
  ];

  constructor(private route: ActivatedRoute) { }

  setActiveTab(tab: 'overview' | 'documents' | 'ai-analysis' | 'timeline' | 'notes') {
    this.activeTab.set(tab);
  }

  toggleSensitiveData() {
    this.showSensitiveData.update(v => !v);
  }

  maskValue(value: string, showFirst: number = 3): string {
    if (this.showSensitiveData()) return value;
    return value.substring(0, showFirst) + '•'.repeat(value.length - showFirst);
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Processing': 'badge-processing',
      'Pending Review': 'badge-pending',
      'Approved': 'badge-approved',
      'Denied': 'badge-denied'
    };
    return classes[status] || 'badge-processing';
  }

  getDocStatusIcon(status: string) {
    switch (status) {
      case 'Verified': return this.icons.checkCircle;
      case 'Pending Review': return this.icons.clock;
      case 'Missing': return this.icons.xCircle;
      default: return this.icons.clock;
    }
  }

  getDocStatusClass(status: string): string {
    switch (status) {
      case 'Verified': return 'status-verified';
      case 'Pending Review': return 'status-pending';
      case 'Missing': return 'status-missing';
      default: return '';
    }
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'var(--color-success)';
    if (confidence >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }
}
