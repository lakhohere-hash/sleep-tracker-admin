import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
    name: string;
    role: string;
  };
  token?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  loginAttempts: number = 0;

  // Animation states
  isHovering: boolean = false;
  isFocused: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check for saved credentials
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }

    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.loginAttempts++;

      const credentials: LoginCredentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      console.log('🚀 Attempting legendary login...', credentials.email);

      // Save email if remember me is checked
      if (this.loginForm.get('rememberMe')?.value) {
        localStorage.setItem('rememberedEmail', credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Simulate API call (replace with actual auth service)
      this.simulateLogin(credentials);
    } else {
      this.markFormGroupTouched();
    }
  }

  private simulateLogin(credentials: LoginCredentials): void {
    setTimeout(() => {
      // Mock authentication logic
      if (credentials.email === 'admin@admin.com' && credentials.password === 'admin123') {
        const mockResponse: AuthResponse = {
          success: true,
          user: {
            email: credentials.email,
            name: 'Admin User',
            role: 'Administrator'
          },
          token: 'mock-jwt-token-' + Date.now()
        };

        // Store token and user info
        localStorage.setItem('authToken', mockResponse.token!);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));

        this.isLoading = false;
        
        // FIXED: Use optional chaining to safely access user property
        console.log('✅ Legendary login successful!', mockResponse.user?.email);
        
        // Show success animation before redirect
        this.showSuccessAnimation();
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);

      } else {
        this.isLoading = false;
        this.errorMessage = this.generateErrorMessage();
        console.warn('❌ Login failed:', this.errorMessage);
      }
    }, 2000);
  }

  private generateErrorMessage(): string {
    const errors = [
      '🔐 Invalid credentials. Are you sure you\'re legendary enough?',
      '🚫 Access denied. Your admin powers need verification.',
      '💥 Authentication failed. Double-check your legendary status.',
      '🛡️ Security breach detected. Please verify your identity.'
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  }

  private showSuccessAnimation(): void {
    // This would trigger CSS animations
    console.log('🎉 Showing success animation!');
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

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Quick fill for testing
  fillTestCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@admin.com',
      password: 'admin123',
      rememberMe: true
    });
    console.log('🔧 Test credentials filled for legendary testing');
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Forgot password handler
  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (email && this.loginForm.get('email')?.valid) {
      alert(`📧 Password reset link sent to: ${email}`);
    } else {
      alert('📧 Please enter your email address first');
    }
  }

  // Animation handlers
  onInputFocus(): void {
    this.isFocused = true;
  }

  onInputBlur(): void {
    this.isFocused = false;
  }

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }

  // Get current year for footer
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Get system stats for display
  getSystemStats(): string {
    const stats = [
      '260+ Sounds Managed',
      '15K+ Active Users', 
      '99.9% Uptime',
      'Real-time Analytics',
      'AI-Powered Insights',
      'Enterprise Security'
    ];
    return stats[Math.floor(Math.random() * stats.length)];
  }
}