import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginCredentials, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Make it standalone
  imports: [CommonModule, ReactiveFormsModule], // Add required modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginCredentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      console.log('🚀 Attempting legendary login...', credentials.email);

      this.authService.login(credentials).subscribe({
        next: (response: AuthResponse) => {
          this.isLoading = false;
          
          if (response.success) {
            console.log('✅ Legendary login successful!', response.user?.email);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Login failed. Please check your credentials.';
            console.warn('❌ Login failed:', this.errorMessage);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          console.error('💥 Login error:', error);
        },
        complete: () => {
          console.log('🎯 Login process completed');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    
    if (emailControl?.hasError('required')) {
      return 'Email is required to access legendary features';
    }
    
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'Password is required to unlock admin powers';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters of pure power';
    }
    
    return '';
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return '🚫 Unable to connect to the legendary server. Check your internet connection.';
    } else if (error.status === 401) {
      return '🔐 Invalid credentials. Are you sure you\'re legendary enough?';
    } else if (error.status === 403) {
      return '⛔ Access denied. Your admin powers have been revoked.';
    } else if (error.status === 429) {
      return '🚦 Too many login attempts. Take a breath and try again.';
    } else if (error.status >= 500) {
      return '⚡ Server is experiencing legendary issues. Try again soon.';
    } else {
      return '💥 Unexpected error occurred. Our elite team has been notified.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Quick fill for testing (remove in production)
  fillTestCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@admin.com',
      password: 'admin123'
    });
    console.log('🔧 Test credentials filled for legendary testing');
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Get current year for footer
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}