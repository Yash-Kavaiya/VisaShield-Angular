import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, User, Bell, Shield, Moon, Sun, Monitor } from 'lucide-angular';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class Settings {
    // Icons
    readonly icons = {
        save: Save,
        user: User,
        bell: Bell,
        shield: Shield,
        moon: Moon,
        sun: Sun,
        monitor: Monitor
    };

    // State
    activeTab = signal<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

    // Form Data
    profile = signal({
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@visashield.ai',
        title: 'Immigration Attorney',
        bio: 'Specializing in H-1B and L-1 visa petitions with 8 years of experience.',
        phone: '+1 (555) 123-4567'
    });

    notifications = signal({
        emailAlerts: true,
        browserPush: true,
        caseUpdates: true,
        marketingEmails: false,
        weeklyDigest: true
    });

    security = signal({
        twoFactor: true,
        sessionTimeout: '30',
        lastPasswordChange: '2024-11-15'
    });

    appearance = signal({
        theme: 'system' as 'light' | 'dark' | 'system',
        density: 'comfortable' as 'comfortable' | 'compact'
    });

    setActiveTab(tab: 'profile' | 'notifications' | 'security' | 'appearance') {
        this.activeTab.set(tab);
    }

    saveSettings() {
        // In a real app, this would call a service
        console.log('Settings saved:', {
            profile: this.profile(),
            notifications: this.notifications(),
            security: this.security(),
            appearance: this.appearance()
        });
        alert('Settings saved successfully!');
    }
}
