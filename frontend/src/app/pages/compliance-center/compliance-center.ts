import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShieldCheck, AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-angular';

@Component({
    selector: 'app-compliance-center',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './compliance-center.html',
    styleUrl: './compliance-center.scss'
})
export class ComplianceCenter {
    // Icons
    readonly icons = {
        shield: ShieldCheck,
        alert: AlertTriangle,
        file: FileText,
        check: CheckCircle,
        clock: Clock
    };

    // State
    complianceScore = signal(98);

    alerts = signal([
        {
            id: 1,
            type: 'warning',
            title: 'H-1B Cap Registration Deadline Approaching',
            description: 'The registration period for FY 2026 H-1B cap closes in 14 days.',
            date: '2024-12-18'
        },
        {
            id: 2,
            type: 'info',
            title: 'New DOL Wage Data Available',
            description: 'Department of Labor has released updated prevailing wage data for Q1 2025.',
            date: '2024-12-15'
        }
    ]);

    recentAudits = signal([
        {
            id: 'AUD-2024-001',
            action: 'Case File Access',
            user: 'Sarah Chen',
            details: 'Accessed sensitive documents for Case #10234',
            time: '10 mins ago',
            status: 'success'
        },
        {
            id: 'AUD-2024-002',
            action: 'Document Deletion',
            user: 'Admin System',
            details: 'Automated retention policy deletion of 3 expired files',
            time: '2 hours ago',
            status: 'success'
        },
        {
            id: 'AUD-2024-003',
            action: 'Login Attempt',
            user: 'Unknown Device',
            details: 'Failed login attempt from IP 192.168.1.1',
            time: '4 hours ago',
            status: 'warning'
        }
    ]);

    regulatoryUpdates = signal([
        {
            id: 1,
            agency: 'USCIS',
            title: 'Fee Schedule Update Proposal',
            summary: 'Proposed rule to adjust certain immigration benefit request fees.',
            impact: 'High',
            date: '2024-12-10'
        },
        {
            id: 2,
            agency: 'DHS',
            title: 'Modernizing H-1B Requirements',
            summary: 'Final rule to strengthen integrity and reduce fraud in the registration process.',
            impact: 'Medium',
            date: '2024-12-05'
        }
    ]);

    getStatusColor(status: string): string {
        switch (status) {
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    }

    getImpactColor(impact: string): string {
        switch (impact.toLowerCase()) {
            case 'high': return 'text-red-700 bg-red-50 border-red-100';
            case 'medium': return 'text-amber-700 bg-amber-50 border-amber-100';
            case 'low': return 'text-blue-700 bg-blue-50 border-blue-100';
            default: return 'text-slate-700 bg-slate-50 border-slate-100';
        }
    }
}
