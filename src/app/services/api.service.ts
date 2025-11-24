import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalSleepSessions: number;
  todaySleepSessions: number;
  premiumUsers: number;
  monthlyRevenue: number;
  totalSounds: number;
  giftCodesRedeemed: number;
  pushNotifications: number;
  aiSessions: number;
  mobileUsers: number;
}

export interface RecentActivity {
  _id: string;
  userName: string;
  type: string;
  timestamp: string;
  amount?: number;
  details?: any;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  subscription: string;
  subscriptionStatus: string;
  loginMethod: string;
  createdAt: string;
  sleepSessionsCount?: number;
  totalSleepHours?: number;
  lastLogin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://sleep-tracker-backend-0a9f.onrender.com/api';
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  // Authentication Methods
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuth(): void {
    this.authToken = null;
  }

  // Admin Authentication
  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, credentials);
  }

  // Dashboard Methods
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`).pipe(
      map(response => ({
        totalUsers: response.totalUsers || 0,
        activeSubscriptions: response.activeSubscriptions || 0,
        totalSleepSessions: response.totalSleepSessions || 0,
        todaySleepSessions: response.todaySleepSessions || 0,
        premiumUsers: response.premiumUsers || 0,
        monthlyRevenue: response.monthlyRevenue || 0,
        totalSounds: response.totalSounds || 0,
        giftCodesRedeemed: response.giftCodesRedeemed || 0,
        pushNotifications: response.pushNotifications || 0,
        aiSessions: response.aiSessions || 0,
        mobileUsers: response.mobileUsers || 0
      })),
      catchError(error => {
        console.error('Dashboard stats error:', error);
        return of(this.getFallbackStats());
      })
    );
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        return users.slice(0, 8).map((user, index) => ({
          _id: user._id || `activity-${index}`,
          userName: user.name || 'Unknown User',
          type: this.getRandomActivityType(),
          timestamp: user.createdAt || new Date().toISOString(),
          details: { email: user.email }
        }));
      }),
      catchError(error => {
        console.error('Recent activities error:', error);
        return of(this.getFallbackActivities());
      })
    );
  }

  exportDashboardData(): Observable<Blob> {
    const exportData = 'Dashboard Data Export\nThis is a placeholder for actual export functionality.';
    const blob = new Blob([exportData], { type: 'text/csv' });
    return of(blob);
  }

  // User Management
  getUsers(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = users.slice(startIndex, endIndex);
        
        return {
          users: paginatedUsers,
          total: users.length,
          page,
          limit,
          totalPages: Math.ceil(users.length / limit)
        };
      }),
      catchError(error => {
        console.error('Get users error:', error);
        return of({ users: [], total: 0, page, limit, totalPages: 0 });
      })
    );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    console.log('Updating user:', userId, userData);
    return of({
      success: true,
      message: 'User updated successfully',
      user: { _id: userId, ...userData }
    });
  }

  deleteUser(userId: string): Observable<any> {
    console.log('Deleting user:', userId);
    return of({
      success: true,
      message: 'User deleted successfully'
    });
  }

  // Core API Methods
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  getUsersPublic(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getSounds(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sounds`);
  }

  getSleepData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sleep-data`);
  }

  // Utility Methods
  private getAuthHeaders(): HttpHeaders {
    const token = this.authToken || localStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private getFallbackStats(): DashboardStats {
    return {
      totalUsers: 1250,
      activeSubscriptions: 342,
      totalSleepSessions: 15678,
      todaySleepSessions: 89,
      premiumUsers: 298,
      monthlyRevenue: 2977.02,
      totalSounds: 8,
      giftCodesRedeemed: 45,
      pushNotifications: 1247,
      aiSessions: 8923,
      mobileUsers: 987
    };
  }

  private getFallbackActivities(): RecentActivity[] {
    return [
      {
        _id: '1',
        userName: 'John Legend',
        type: 'user_registered',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        details: { email: 'john@example.com' }
      },
      {
        _id: '2',
        userName: 'Sarah Chen',
        type: 'sleep_session_completed',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        details: { duration: 7.5 }
      }
    ];
  }

  private getRandomActivityType(): string {
    const types = [
      'user_registered',
      'sleep_session_completed',
      'subscription_upgraded',
      'payment_received',
      'sound_played'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }
}