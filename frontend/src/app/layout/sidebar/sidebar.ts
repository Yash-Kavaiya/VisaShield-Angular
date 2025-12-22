import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, FolderOpen, Brain, BarChart3, FileText, ShieldCheck, Settings, ChevronLeft, ChevronRight, LogOut, User, ChevronDown, ChevronUp, MessageSquare } from 'lucide-angular';

interface NavItem {
  label: string;
  icon: any;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  // Icons
  readonly icons = {
    dashboard: LayoutDashboard,
    cases: FolderOpen,
    ai: Brain,
    askVia: MessageSquare,
    analytics: BarChart3,
    documents: FileText,
    compliance: ShieldCheck,
    settings: Settings,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    logout: LogOut,
    user: User,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp
  };

  // State
  isCollapsed = signal(false);
  expandedMenus = signal<Set<string>>(new Set());

  // Output for parent component
  collapsedChange = output<boolean>();

  // Navigation items
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: this.icons.dashboard, route: '/dashboard' },
    {
      label: 'Cases',
      icon: this.icons.cases,
      children: [
        { label: 'All Cases', route: '/cases' },
        { label: 'Pending Review', route: '/cases?status=pending' },
        { label: 'Approved', route: '/cases?status=approved' },
        { label: 'Denied', route: '/cases?status=denied' }
      ]
    },
    { label: 'AI Adjudicator', icon: this.icons.ai, route: '/ai-adjudicator' },
    { label: 'AskVia Assistant', icon: this.icons.askVia, route: '/ask-via' },
    { label: 'Analytics', icon: this.icons.analytics, route: '/analytics' },
    { label: 'Documents', icon: this.icons.documents, route: '/documents' },
    { label: 'Compliance', icon: this.icons.compliance, route: '/compliance' },
    { label: 'Settings', icon: this.icons.settings, route: '/settings' }
  ];

  // User info (mock)
  user = {
    name: 'Sarah Chen',
    role: 'Immigration Attorney',
    avatar: ''
  };

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
    this.collapsedChange.emit(this.isCollapsed());
  }

  toggleMenu(label: string) {
    this.expandedMenus.update(menus => {
      const newMenus = new Set(menus);
      if (newMenus.has(label)) {
        newMenus.delete(label);
      } else {
        newMenus.add(label);
      }
      return newMenus;
    });
  }

  isMenuExpanded(label: string): boolean {
    return this.expandedMenus().has(label);
  }
}
