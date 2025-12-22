import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, ShieldCheck, Award, Building2 } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  readonly icons = {
    eye: Eye,
    eyeOff: EyeOff,
    shieldCheck: ShieldCheck,
    award: Award,
    building: Building2
  };

  // Form state
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  updateEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  updatePassword(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  toggleRememberMe() {
    this.rememberMe.update(v => !v);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any credentials
    this.isLoading.set(false);
    this.router.navigate(['/dashboard']);
  }
}
