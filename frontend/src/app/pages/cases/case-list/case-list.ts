import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Download, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Eye, UserPlus, Flag, Trash2, SlidersHorizontal, X } from 'lucide-angular';

interface Case {
  id: string;
  caseNumber: string;
  applicant: string;
  visaType: 'H-1B' | 'O-1' | 'EB-2' | 'I-140' | 'I-129';
  status: 'Processing' | 'Pending Review' | 'Approved' | 'Denied' | 'RFE Issued';
  confidence: number;
  attorney: string;
  filedDate: string;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './case-list.html',
  styleUrl: './case-list.scss'
})
export class CaseList {
  readonly icons = {
    search: Search,
    filter: Filter,
    download: Download,
    plus: Plus,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    moreHorizontal: MoreHorizontal,
    eye: Eye,
    userPlus: UserPlus,
    flag: Flag,
    trash: Trash2,
    sliders: SlidersHorizontal,
    x: X
  };

  // For template use
  readonly Math = Math;

  // Filter state
  searchQuery = signal('');
  statusFilter = signal<string>('all');
  visaTypeFilter = signal<string>('all');
  showFilters = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);

  // Selection
  selectedCases = signal<Set<string>>(new Set());
  selectAll = signal(false);

  // All cases (mock data)
  allCases: Case[] = [
    { id: '1', caseNumber: 'H1B-2024-00847', applicant: 'John Davidson', visaType: 'H-1B', status: 'Processing', confidence: 87, attorney: 'Sarah Chen', filedDate: '2024-12-15', lastUpdated: '5 min ago', priority: 'high' },
    { id: '2', caseNumber: 'O1-2024-01234', applicant: 'Maria Santos', visaType: 'O-1', status: 'Pending Review', confidence: 92, attorney: 'James Wilson', filedDate: '2024-12-14', lastUpdated: '12 min ago', priority: 'medium' },
    { id: '3', caseNumber: 'EB2-2024-00567', applicant: 'Wei Liu', visaType: 'EB-2', status: 'Approved', confidence: 98, attorney: 'Sarah Chen', filedDate: '2024-12-10', lastUpdated: '1 hour ago', priority: 'low' },
    { id: '4', caseNumber: 'H1B-2024-00856', applicant: 'Priya Kumar', visaType: 'H-1B', status: 'Processing', confidence: 78, attorney: 'Michael Brown', filedDate: '2024-12-13', lastUpdated: '2 hours ago', priority: 'high' },
    { id: '5', caseNumber: 'I140-2024-00123', applicant: 'Alex Thompson', visaType: 'I-140', status: 'Denied', confidence: 34, attorney: 'Sarah Chen', filedDate: '2024-12-08', lastUpdated: '3 hours ago', priority: 'low' },
    { id: '6', caseNumber: 'H1B-2024-00912', applicant: 'Yuki Tanaka', visaType: 'H-1B', status: 'RFE Issued', confidence: 65, attorney: 'James Wilson', filedDate: '2024-12-12', lastUpdated: '4 hours ago', priority: 'high' },
    { id: '7', caseNumber: 'O1-2024-01289', applicant: 'Carlos Rodriguez', visaType: 'O-1', status: 'Approved', confidence: 95, attorney: 'Michael Brown', filedDate: '2024-12-11', lastUpdated: '5 hours ago', priority: 'medium' },
    { id: '8', caseNumber: 'EB2-2024-00612', applicant: 'Anna Petrov', visaType: 'EB-2', status: 'Processing', confidence: 81, attorney: 'Sarah Chen', filedDate: '2024-12-09', lastUpdated: '6 hours ago', priority: 'medium' },
    { id: '9', caseNumber: 'I129-2024-00345', applicant: 'Mohammed Ali', visaType: 'I-129', status: 'Pending Review', confidence: 72, attorney: 'James Wilson', filedDate: '2024-12-07', lastUpdated: '1 day ago', priority: 'low' },
    { id: '10', caseNumber: 'H1B-2024-00978', applicant: 'Sophie Martin', visaType: 'H-1B', status: 'Approved', confidence: 96, attorney: 'Michael Brown', filedDate: '2024-12-06', lastUpdated: '1 day ago', priority: 'low' },
    { id: '11', caseNumber: 'O1-2024-01345', applicant: 'David Kim', visaType: 'O-1', status: 'Processing', confidence: 89, attorney: 'Sarah Chen', filedDate: '2024-12-05', lastUpdated: '2 days ago', priority: 'medium' },
    { id: '12', caseNumber: 'EB2-2024-00678', applicant: 'Elena Volkov', visaType: 'EB-2', status: 'Denied', confidence: 42, attorney: 'James Wilson', filedDate: '2024-12-04', lastUpdated: '2 days ago', priority: 'low' }
  ];

  // Computed filtered cases
  filteredCases = computed(() => {
    let cases = [...this.allCases];

    // Search filter
    const query = this.searchQuery().toLowerCase();
    if (query) {
      cases = cases.filter(c =>
        c.caseNumber.toLowerCase().includes(query) ||
        c.applicant.toLowerCase().includes(query) ||
        c.attorney.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter() !== 'all') {
      cases = cases.filter(c => c.status === this.statusFilter());
    }

    // Visa type filter
    if (this.visaTypeFilter() !== 'all') {
      cases = cases.filter(c => c.visaType === this.visaTypeFilter());
    }

    return cases;
  });

  // Paginated cases
  paginatedCases = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredCases().slice(start, end);
  });

  // Total pages
  totalPages = computed(() => Math.ceil(this.filteredCases().length / this.pageSize()));

  // Status options
  statusOptions = ['all', 'Processing', 'Pending Review', 'Approved', 'Denied', 'RFE Issued'];
  visaTypeOptions = ['all', 'H-1B', 'O-1', 'EB-2', 'I-140', 'I-129'];

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  setVisaTypeFilter(type: string) {
    this.visaTypeFilter.set(type);
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.visaTypeFilter.set('all');
    this.currentPage.set(1);
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  toggleSelectAll() {
    if (this.selectAll()) {
      this.selectedCases.set(new Set());
      this.selectAll.set(false);
    } else {
      const allIds = new Set(this.paginatedCases().map(c => c.id));
      this.selectedCases.set(allIds);
      this.selectAll.set(true);
    }
  }

  toggleCaseSelection(id: string) {
    this.selectedCases.update(selected => {
      const newSelected = new Set(selected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }

  isCaseSelected(id: string): boolean {
    return this.selectedCases().has(id);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getVisaTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'H-1B': 'badge-h1b',
      'O-1': 'badge-o1',
      'EB-2': 'badge-eb2',
      'I-140': 'badge-h1b',
      'I-129': 'badge-processing'
    };
    return classes[type] || 'badge-h1b';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Processing': 'badge-processing',
      'Pending Review': 'badge-pending',
      'Approved': 'badge-approved',
      'Denied': 'badge-denied',
      'RFE Issued': 'badge-rfe'
    };
    return classes[status] || 'badge-processing';
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'var(--color-success)';
    if (confidence >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }
}
