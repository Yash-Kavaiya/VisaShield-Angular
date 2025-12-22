import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, TrendingUp, TrendingDown, Clock, Calendar, Download, Filter, RefreshCw, Activity, CheckCircle, XCircle, AlertTriangle, Users, Timer, BarChart2 } from 'lucide-angular';

interface MetricCard {
  label: string;
  value: string | number;
  trend: { value: number; direction: 'up' | 'down' };
  subtitle: string;
  icon: any;
}

interface PerformanceData {
  label: string;
  value: number;
  max: number;
  color: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics {
  readonly icons = {
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    clock: Clock,
    calendar: Calendar,
    download: Download,
    filter: Filter,
    refreshCw: RefreshCw,
    activity: Activity,
    checkCircle: CheckCircle,
    xCircle: XCircle,
    alertTriangle: AlertTriangle,
    users: Users,
    timer: Timer,
    barChart: BarChart2
  };

  // Time range selection
  selectedRange = signal<'7d' | '30d' | '90d' | '1y'>('30d');
  timeRanges: { id: '7d' | '30d' | '90d' | '1y', label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ];

  // Key metrics
  metrics: MetricCard[] = [
    { label: 'Total Cases Processed', value: '4,872', trend: { value: 23, direction: 'up' }, subtitle: 'vs last period', icon: this.icons.activity },
    { label: 'Approval Rate', value: '87.3%', trend: { value: 2.1, direction: 'up' }, subtitle: 'vs last period', icon: this.icons.checkCircle },
    { label: 'Avg Processing Time', value: '2.4 hrs', trend: { value: 15, direction: 'down' }, subtitle: 'faster than last period', icon: this.icons.timer },
    { label: 'AI Accuracy Rate', value: '99.7%', trend: { value: 0.2, direction: 'up' }, subtitle: 'citation verified', icon: this.icons.barChart }
  ];

  // Processing volume by day (last 30 days)
  volumeData = [
    { date: 'Dec 1', approved: 142, denied: 12, pending: 28 },
    { date: 'Dec 2', approved: 156, denied: 15, pending: 32 },
    { date: 'Dec 3', approved: 138, denied: 8, pending: 25 },
    { date: 'Dec 4', approved: 167, denied: 11, pending: 30 },
    { date: 'Dec 5', approved: 145, denied: 14, pending: 27 },
    { date: 'Dec 6', approved: 72, denied: 5, pending: 15 },
    { date: 'Dec 7', approved: 48, denied: 3, pending: 10 },
    { date: 'Dec 8', approved: 159, denied: 13, pending: 35 },
    { date: 'Dec 9', approved: 171, denied: 16, pending: 29 },
    { date: 'Dec 10', approved: 163, denied: 10, pending: 33 },
    { date: 'Dec 11', approved: 148, denied: 12, pending: 26 },
    { date: 'Dec 12', approved: 155, denied: 14, pending: 31 },
    { date: 'Dec 13', approved: 68, denied: 6, pending: 12 },
    { date: 'Dec 14', approved: 52, denied: 4, pending: 8 }
  ];

  // Visa type breakdown
  visaTypeBreakdown = [
    { type: 'H-1B', count: 2341, percentage: 48, color: 'var(--color-navy-primary)' },
    { type: 'O-1', count: 1024, percentage: 21, color: 'var(--color-red-patriot)' },
    { type: 'EB-2', count: 876, percentage: 18, color: 'var(--color-gold)' },
    { type: 'I-140', count: 421, percentage: 9, color: 'var(--color-blue-secondary)' },
    { type: 'Other', count: 210, percentage: 4, color: 'var(--color-gray-400)' }
  ];

  // Attorney performance
  attorneyPerformance = [
    { name: 'Sarah Chen', casesHandled: 487, approvalRate: 92, avgTime: '2.1 hrs' },
    { name: 'James Wilson', casesHandled: 423, approvalRate: 88, avgTime: '2.4 hrs' },
    { name: 'Michael Brown', casesHandled: 398, approvalRate: 89, avgTime: '2.3 hrs' },
    { name: 'Emily Davis', casesHandled: 356, approvalRate: 91, avgTime: '2.0 hrs' },
    { name: 'Robert Kim', casesHandled: 312, approvalRate: 86, avgTime: '2.5 hrs' }
  ];

  // Processing time distribution
  timeDistribution: PerformanceData[] = [
    { label: '< 1 hour', value: 1245, max: 2000, color: 'var(--color-success)' },
    { label: '1-2 hours', value: 1876, max: 2000, color: 'var(--color-blue-secondary)' },
    { label: '2-4 hours', value: 1023, max: 2000, color: 'var(--color-gold)' },
    { label: '4-8 hours', value: 542, max: 2000, color: 'var(--color-warning)' },
    { label: '> 8 hours', value: 186, max: 2000, color: 'var(--color-danger)' }
  ];

  // Status breakdown
  statusBreakdown = [
    { status: 'Approved', count: 4247, color: 'var(--color-success)' },
    { status: 'Denied', count: 312, color: 'var(--color-danger)' },
    { status: 'RFE Issued', count: 156, color: 'var(--color-warning)' },
    { status: 'Pending', count: 157, color: 'var(--color-info)' }
  ];

  setTimeRange(range: '7d' | '30d' | '90d' | '1y') {
    this.selectedRange.set(range);
  }

  getMaxVolume(): number {
    return Math.max(...this.volumeData.map(d => d.approved + d.denied + d.pending));
  }

  getTotalCases(): number {
    return this.statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  }

  getStatusPercentage(count: number): number {
    return Math.round((count / this.getTotalCases()) * 100);
  }

  getDonutOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.visaTypeBreakdown[i].percentage * 2.51;
    }
    return -offset;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}
