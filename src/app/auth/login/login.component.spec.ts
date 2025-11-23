import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

// Mock services
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockAuthService = {
  login: jasmine.createSpy('login').and.returnValue(of({ 
    success: true, 
    token: 'test-token-123',
    user: { 
      id: '1', 
      name: 'Test Admin', 
      email: 'admin@test.com',
      role: 'super-admin' as const
    }
  })),
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false)
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockRouter.navigate.calls.reset();
    mockAuthService.login.calls.reset();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });

  it('should validate email field as required', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should validate password field as required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalse();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalse();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should set isLoading to true during login and then false after', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    
    expect(component.isLoading).toBeTrue();
    
    // Advance time to complete the async operation
    tick();
    
    expect(component.isLoading).toBeFalse();
  }));

  it('should call authService login on form submission', fakeAsync(() => {
    const credentials = { email: 'test@test.com', password: 'password123' };
    component.loginForm.setValue(credentials);
    component.onSubmit();
    
    tick();
    
    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
  }));

  it('should navigate to dashboard on successful login', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    
    tick();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show error message on login failure', fakeAsync(() => {
    mockAuthService.login.and.returnValue(of({ success: false, message: 'Login failed' }));
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    
    tick();
    
    expect(component.errorMessage).toBe('Login failed');
  }));

  it('should handle login errors gracefully', fakeAsync(() => {
    mockAuthService.login.and.returnValue(of({ success: false }));
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    
    tick();
    
    expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
  }));

  it('should get email error messages correctly', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe('Email is required to access legendary features');

    emailControl?.setValue('invalid');
    emailControl?.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe('Please enter a valid email address');
  });

  it('should get password error messages correctly', () => {
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe('Password is required to unlock admin powers');

    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe('Password must be at least 6 characters of pure power');
  });

  it('should fill test credentials', () => {
    component.fillTestCredentials();
    expect(component.loginForm.value).toEqual({ email: 'admin@admin.com', password: 'admin123' });
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should get current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.getCurrentYear()).toBe(currentYear);
  });

  it('should handle invalid form submission', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should reset error message on new submission', fakeAsync(() => {
    component.errorMessage = 'Previous error';
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    
    tick();
    
    expect(component.errorMessage).toBe('');
  }));
});