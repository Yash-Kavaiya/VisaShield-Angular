import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, Search, Bell, HelpCircle, User, ChevronDown, Menu, Lock } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly icons = {
    search: Search,
    bell: Bell,
    help: HelpCircle,
    user: User,
    chevronDown: ChevronDown,
    menu: Menu,
    lock: Lock
  };

  // Inputs
  sidebarCollapsed = input<boolean>(false);

  // State
  searchQuery = signal('');
  notificationCount = signal(3);
  showUserMenu = signal(false);
  showNotifications = signal(false);

  // Breadcrumbs (in a real app, this would come from route data)
  breadcrumbs = signal([
    { label: 'Home', route: '/' },
    { label: 'Dashboard', route: '/dashboard' }
  ]);

  // User info (mock)
  user = {
    name: 'Sarah Chen',
    email: 'sarah.chen@lawfirm.com',
    role: 'Immigration Attorney',
    avatar: ''
  };

  // Mock notifications
  notifications = [
    { id: 1, type: 'success', message: 'Case H1B-2024-00856 approved', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Citation verification needed', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'New policy update available', time: '2 hours ago' }
  ];

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    if (this.showUserMenu()) {
      this.showNotifications.set(false);
    }
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.showUserMenu.set(false);
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
