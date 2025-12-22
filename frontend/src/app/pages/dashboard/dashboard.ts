import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Activity, Upload, FileText, ShieldCheck, Eye, UserPlus, Flag, MoreHorizontal, ArrowRight, RefreshCw } from 'lucide-angular';

interface MetricCard {
  label: string;
  value: string | number;
  trend: { value: number; direction: 'up' | 'down' };
  status?: 'success' | 'warning' | 'danger';
}

interface Case {
  id: string;
  caseNumber: string;
  applicant: string;
  visaType: 'H-1B' | 'O-1' | 'EB-2' | 'I-140';
  status: 'Processing' | 'Pending Review' | 'Approved' | 'Denied';
  confidence: number;
  attorney: string;
  updated: string;
}

interface Alert {
  id: number;
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
  time: string;
}

interface ProcessingItem {
  caseId: string;
  visaType: string;
  progress: number;
  elapsed: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  readonly icons = {
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    clock: Clock,
    alertTriangle: AlertTriangle,
    checkCircle: CheckCircle,
    activity: Activity,
    upload: Upload,
    fileText: FileText,
    shieldCheck: ShieldCheck,
    eye: Eye,
    userPlus: UserPlus,
    flag: Flag,
    moreHorizontal: MoreHorizontal,
    arrowRight: ArrowRight,
    refreshCw: RefreshCw
  };

  // Current date/time
  currentDate = new Date();
  userName = 'Sarah';

  // Metrics
  metrics: MetricCard[] = [
    { label: 'Cases Processed Today', value: 127, trend: { value: 12, direction: 'up' }, status: 'success' },
    { label: 'Pending AI Review', value: 43, trend: { value: 5, direction: 'down' }, status: 'warning' },
    { label: 'Manual Review Required', value: 8, trend: { value: 2, direction: 'up' }, status: 'danger' },
    { label: 'System Health', value: '99.2%', trend: { value: 0.1, direction: 'up' }, status: 'success' }
  ];

  // Active cases
  cases: Case[] = [
    { id: '1', caseNumber: 'H1B-2024-00847', applicant: 'John D***', visaType: 'H-1B', status: 'Processing', confidence: 87, attorney: 'Sarah Chen', updated: '5 min ago' },
    { id: '2', caseNumber: 'O1-2024-01234', applicant: 'Maria S***', visaType: 'O-1', status: 'Pending Review', confidence: 92, attorney: 'James Wilson', updated: '12 min ago' },
    { id: '3', caseNumber: 'EB2-2024-00567', applicant: 'Wei L***', visaType: 'EB-2', status: 'Approved', confidence: 98, attorney: 'Sarah Chen', updated: '1 hour ago' },
    { id: '4', caseNumber: 'H1B-2024-00856', applicant: 'Priya K***', visaType: 'H-1B', status: 'Processing', confidence: 78, attorney: 'Michael Brown', updated: '2 hours ago' },
    { id: '5', caseNumber: 'I140-2024-00123', applicant: 'Alex T***', visaType: 'I-140', status: 'Denied', confidence: 34, attorney: 'Sarah Chen', updated: '3 hours ago' }
  ];

  // Processing queue
  processingQueue: ProcessingItem[] = [
    { caseId: 'H1B-2024-00847', visaType: 'H-1B', progress: 67, elapsed: '2:34' },
    { caseId: 'O1-2024-01235', visaType: 'O-1', progress: 23, elapsed: '0:45' },
    { caseId: 'EB2-2024-00568', visaType: 'EB-2', progress: 89, elapsed: '4:12' }
  ];

  // Alerts
  alerts: Alert[] = [
    { id: 1, type: 'success', message: 'Case H1B-2024-00856 approved', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Citation verification needed for O1-2024-01234', time: '15 min ago' },
    { id: 3, type: 'danger', message: 'PII detected in uploaded document', time: '1 hour ago' },
    { id: 4, type: 'info', message: 'New USCIS policy update available', time: '2 hours ago' }
  ];

  // Weekly data for chart
  weeklyData = [
    { day: 'Mon', approved: 45, denied: 5, pending: 12 },
    { day: 'Tue', approved: 52, denied: 3, pending: 18 },
    { day: 'Wed', approved: 38, denied: 8, pending: 15 },
    { day: 'Thu', approved: 61, denied: 4, pending: 10 },
    { day: 'Fri', approved: 48, denied: 6, pending: 14 },
    { day: 'Sat', approved: 22, denied: 2, pending: 8 },
    { day: 'Sun', approved: 15, denied: 1, pending: 5 }
  ];

  getGreeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  formatDate(): string {
    return this.currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getVisaTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'H-1B': 'badge-h1b',
      'O-1': 'badge-o1',
      'EB-2': 'badge-eb2',
      'I-140': 'badge-h1b'
    };
    return classes[type] || 'badge-h1b';
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

  getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'var(--color-success)';
    if (confidence >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  getAlertIcon(type: string): any {
    switch (type) {
      case 'success': return this.icons.checkCircle;
      case 'warning': return this.icons.alertTriangle;
      case 'danger': return this.icons.alertTriangle;
      default: return this.icons.activity;
    }
  }

  getMaxValue(): number {
    return Math.max(...this.weeklyData.map(d => d.approved + d.denied + d.pending));
  }
}
