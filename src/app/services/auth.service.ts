import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// HARDCODED API URL - MALIK'S PRODUCTION BACKEND
const API_BASE_URL = 'https://sleep-tracker-backend-0a9f.onrender.com';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_BASE_URL + '/api';
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'sleep_tracker_admin_token';
  private userKey = 'sleep_tracker_admin_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  // LEGENDARY LOGIN METHOD - SMOOTHER THAN MALIK'S OPERATIONS
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('🚀 Attempting legendary login to:', `${this.apiUrl}/admin/login`);
    
    // For testing - REMOVE IN PRODUCTION
    if (credentials.email === 'admin@admin.com' && credentials.password === 'admin123') {
      console.log('🔧 Using legendary test login');
      
      const mockUser: AdminUser = {
        id: '1',
        email: credentials.email,
        name: 'Legendary Administrator',
        role: 'super-admin',
        lastLogin: new Date().toISOString()
      };
      
      const mockResponse: AuthResponse = {
        success: true,
        token: 'legendary-jwt-token-' + Date.now(),
        user: mockUser
      };
      
      return of(mockResponse).pipe(
        tap(response => {
          this.storeAuthData(response.token!, mockUser);
          this.currentUserSubject.next(mockUser);
          console.log('✅ Legendary test login successful!');
        })
      );
    }

    // REAL API CALL FOR PRODUCTION
    return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.token && response.user) {
          console.log('✅ Legendary authentication successful!');
          this.storeAuthData(response.token, response.user);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError((error: any) => {
        console.error('💥 Legendary authentication failed:', error);
        return of({
          success: false,
          message: this.getErrorMessage(error)
        });
      })
    );
  }

  // LOGOUT THAT CLEANS UP LIKE A PRO
  logout(): void {
    // Call logout endpoint if available
    this.http.post(`${this.apiUrl}/admin/logout`, {}).pipe(
      catchError(error => of(null))
    ).subscribe();

    // Clear local storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    
    console.log('🔒 Legendary logout completed');
    this.router.navigate(['/login']);
  }

  // AUTHENTICATION CHECK THAT NEVER FAILS
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // For test tokens, always return true
    if (token.startsWith('legendary-jwt-token-')) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // TOKEN GETTER THAT'S RELIABLE
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // CURRENT USER GETTER
  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  // ROLE CHECKS FOR PERMISSIONS
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && (user.role === 'admin' || user.role === 'super-admin');
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'super-admin';
  }

  // SESSION VALIDATION THAT'S BULLETPROOF
  validateSession(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    const token = this.getToken();
    if (token && token.startsWith('legendary-jwt-token-')) {
      return of(true);
    }

    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/admin/validate-session`).pipe(
      map(response => response.valid),
      tap(isValid => {
        if (!isValid) {
          this.logout();
        }
      }),
      catchError(error => {
        this.logout();
        return of(false);
      })
    );
  }

  // PRIVATE METHODS THAT WORK LIKE MAGIC
  private storeAuthData(token: string, user: AdminUser): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (this.isAuthenticated()) {
          this.currentUserSubject.next(user);
          console.log('🔄 Loaded legendary stored session:', user.email);
        } else {
          this.clearStoredAuth();
        }
      } catch {
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Unable to connect to the legendary server. Check your connection.';
    } else if (error.status === 401) {
      return 'Invalid email or password.';
    } else if (error.status === 403) {
      return 'Access denied. Insufficient permissions.';
    } else if (error.status === 429) {
      return 'Too many login attempts. Please try again later.';
    } else {
      return 'Login failed. Please try again.';
    }
  }

  // PASSWORD CHANGE FOR SECURITY CONSCIOUS ADMINS
  changePassword(oldPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/admin/change-password`,
      { oldPassword, newPassword }
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to change password'
        });
      })
    );
  }

  // LOGIN HISTORY FOR SECURITY AUDITING
  getLoginHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/login-history`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  // REFRESH TOKEN FOR SEAMLESS EXPERIENCE
  refreshToken(): Observable<{ success: boolean; token?: string }> {
    return this.http.post<{ success: boolean; token?: string }>(
      `${this.apiUrl}/admin/refresh-token`,
      {}
    ).pipe(
      catchError(error => {
        this.logout();
        return of({ success: false });
      })
    );
  }
}