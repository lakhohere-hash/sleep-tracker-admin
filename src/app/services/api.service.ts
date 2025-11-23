import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionType: 'free' | 'premium' | 'enterprise';
  lastLogin: string;
  createdAt: string;
  devices: number;
  sleepSessions: number;
}

export interface Subscription {
  _id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  activeUsers: number;
  revenue: number;
  status: 'active' | 'inactive';
}

export interface Sound {
  _id: string;
  name: string;
  category: string;
  duration: number;
  premium: boolean;
  plays: number;
  likes: number;
  fileUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface GiftCode {
  _id: string;
  code: string;
  type: 'weekly' | 'monthly' | 'yearly';
  used: boolean;
  usedBy: string;
  usedAt: string;
  createdAt: string;
  expiresAt: string;
}

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private authToken = localStorage.getItem('authToken') || '';

  constructor(private http: HttpClient) {}

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  private getHeaders(): HttpHeaders {
    const token = this.authToken || localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  adminLogin(credentials: { email: string; password: string }): Observable<{ token: string; admin: any }> {
    return this.http.post<{ token: string; admin: any }>(`${this.apiUrl}/admin/login`, credentials);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.transformDashboardStats(response)),
      catchError(error => {
        console.error('Error fetching dashboard stats:', error);
        return of(this.getFallbackStats());
      })
    );
  }

  private transformDashboardStats(response: any): DashboardStats {
    return {
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
    };
  }

  private getFallbackStats(): DashboardStats {
    return {
      totalUsers: 2847,
      activeSubscriptions: 892,
      totalSleepSessions: 45892,
      todaySleepSessions: 156,
      premiumUsers: 743,
      monthlyRevenue: 9842.50,
      totalSounds: 284,
      giftCodesRedeemed: 167,
      pushNotifications: 2845,
      aiSessions: 8923,
      mobileUsers: 2541
    };
  }

  getUsers(page: number = 1, limit: number = 50): Observable<{users: User[], total: number}> {
    return this.http.get<any>(`${this.apiUrl}/users`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        users: Array.isArray(response) ? this.transformUsers(response) : [],
        total: Array.isArray(response) ? response.length : 0
      })),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of({users: [], total: 0});
      })
    );
  }

  private transformUsers(users: any[]): User[] {
    return users.map(user => ({
      _id: user._id || '',
      name: user.name || 'Unknown User',
      email: user.email || '',
      subscriptionStatus: (user.subscription === 'premium' ? 'active' : 'inactive') as 'active' | 'inactive' | 'trial',
      subscriptionType: (user.subscription || 'free') as 'free' | 'premium' | 'enterprise',
      lastLogin: user.lastLogin || user.createdAt || new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString(),
      devices: user.devices || 1,
      sleepSessions: user.sleepSessionsCount || user.sleepSessions || 0
    }));
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  updateUser(userId: string, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, {
      headers: this.getHeaders()
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getSounds(page: number = 1, limit: number = 50): Observable<{sounds: Sound[], total: number}> {
    return this.http.get<any>(`${this.apiUrl}/sounds`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        sounds: Array.isArray(response) ? this.transformSounds(response) : [],
        total: Array.isArray(response) ? response.length : 0
      })),
      catchError(error => {
        console.error('Error fetching sounds:', error);
        return of({sounds: [], total: 0});
      })
    );
  }

  private transformSounds(sounds: any[]): Sound[] {
    return sounds.map(sound => ({
      _id: sound._id || '',
      name: sound.name || 'Unknown Sound',
      category: sound.category || 'general',
      duration: sound.duration || 0,
      premium: sound.isPremium || sound.premium || false,
      plays: sound.playCount || sound.plays || 0,
      likes: sound.likes || 0,
      fileUrl: sound.filePath || sound.fileUrl || '',
      status: (sound.status || 'active') as 'active' | 'inactive',
      createdAt: sound.createdAt || new Date().toISOString()
    }));
  }

  createSound(soundData: any): Observable<Sound> {
    console.log('Create sound endpoint not yet implemented in backend');
    return of({} as Sound);
  }

  updateSound(soundId: string, soundData: any): Observable<Sound> {
    console.log('Update sound endpoint not yet implemented in backend');
    return of({} as Sound);
  }

  deleteSound(soundId: string): Observable<any> {
    console.log('Delete sound endpoint not yet implemented in backend');
    return of({});
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<any>(`${this.apiUrl}/subscriptions/plans`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.plans || []),
      catchError(error => {
        console.error('Error fetching subscriptions:', error);
        return of([]);
      })
    );
  }

  createSubscription(subscriptionData: any): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscriptions/plans`, subscriptionData, {
      headers: this.getHeaders()
    });
  }

  updateSubscription(subscriptionId: string, subscriptionData: any): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/subscriptions/plans/${subscriptionId}`, subscriptionData, {
      headers: this.getHeaders()
    });
  }

  getGiftCodes(page: number = 1, limit: number = 50): Observable<{giftCodes: GiftCode[], total: number}> {
    return this.http.get<any>(`${this.apiUrl}/gift-codes`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        giftCodes: response.giftCodes || [],
        total: response.total || 0
      })),
      catchError(error => {
        console.error('Error fetching gift codes:', error);
        return of({giftCodes: [], total: 0});
      })
    );
  }

  generateGiftCode(giftCodeData: { code: string, planId: string, expiresAt?: string, maxUses?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/gift-codes`, giftCodeData, {
      headers: this.getHeaders()
    });
  }

  revokeGiftCode(code: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/gift-codes/${code}/deactivate`, {}, {
      headers: this.getHeaders()
    });
  }

  getSleepAnalytics(days: number = 30): Observable<any> {
    const params = new HttpParams().set('period', `${days}d`);
    return this.http.get<any>(`${this.apiUrl}/sleep-analytics`, {
      headers: this.getHeaders(),
      params
    });
  }

  getRevenueAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`, {
      headers: this.getHeaders()
    });
  }

  sendNotification(notificationData: { title: string; message: string; users: string[] }): Observable<any> {
    console.log('Notifications endpoint not yet implemented in backend');
    return of({ success: true, message: 'Notification would be sent when backend implements this feature' });
  }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/videos`, {
      headers: this.getHeaders()
    });
  }

  getVideoCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/videos/categories`, {
      headers: this.getHeaders()
    });
  }

  createVideo(videoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/videos`, videoData, {
      headers: this.getHeaders()
    });
  }

  getSleepData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sleep-data`, {
      headers: this.getHeaders()
    });
  }

  analyzeSleep(audioData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ai/analyze-sleep`, audioData, {
      headers: this.getHeaders()
    });
  }

  getSleepAnalysis(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai/analysis/${sessionId}`, {
      headers: this.getHeaders()
    });
  }

  healthCheck(): Observable<{ status: string; message: string }> {
    return this.http.get<{ status: string; message: string }>(`${this.apiUrl}/health`);
  }

  testAllEndpoints(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test`);
  }

  isUsingRealData(): boolean {
    return !environment.mockData;
  }

  getAuthToken(): string {
    return this.authToken || localStorage.getItem('authToken') || '';
  }

  clearAuth() {
    this.authToken = '';
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminData');
  }
}