import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService, DashboardStats, RecentActivity } from '../services/api.service';

interface ActivityDisplay {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  icon: string;
  type: 'success' | 'warning' | 'info' | 'premium';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalUsers: 0,
    activeSubscriptions: 0,
    totalSleepSessions: 0,
    todaySleepSessions: 0,
    premiumUsers: 0,
    monthlyRevenue: 0,
    totalSounds: 0,
    giftCodesRedeemed: 0,
    pushNotifications: 0,
    aiSessions: 0,
    mobileUsers: 0
  };

  recentActivities: ActivityDisplay[] = [];
  isLoading: boolean = true;
  currentAdmin: any = null;
  
  private refreshInterval: any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
    
    // Auto-refresh data every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadRealData();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  initializeDashboard(): void {
    const storedToken = localStorage.getItem('authToken');
    const storedAdmin = localStorage.getItem('adminData');
    
    if (storedToken && storedAdmin) {
      this.apiService.setAuthToken(storedToken);
      this.currentAdmin = JSON.parse(storedAdmin);
      this.loadRealData();
    } else {
      // Use public data if not authenticated
      this.loadRealData();
    }
  }

  loadRealData(): void {
    this.isLoading = true;

    // Load dashboard stats from existing endpoint
    this.apiService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.stats = stats;
        this.loadRealRecentActivities();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load dashboard stats:', error);
        this.handleDataLoadError();
      }
    });
  }

  loadRealRecentActivities(): void {
    this.apiService.getRecentActivities().subscribe({
      next: (activities: RecentActivity[]) => {
        this.recentActivities = activities.map(activity => ({
          id: activity._id,
          user: activity.userName,
          action: this.formatActivityAction(activity.type),
          timestamp: this.formatTimestamp(activity.timestamp),
          icon: this.getActivityIcon(activity.type),
          type: this.getActivityType(activity.type)
        }));
      },
      error: (error: any) => {
        console.error('Failed to load recent activities:', error);
        this.loadSampleActivities();
      }
    });
  }

  private loadSampleActivities(): void {
    this.recentActivities = [
      { id: '1', user: 'John Legend', action: 'Upgraded to Enterprise Plan', timestamp: '2 mins ago', icon: '💎', type: 'premium' },
      { id: '2', user: 'Sarah Chen', action: 'Completed 8h Sleep Session', timestamp: '5 mins ago', icon: '💤', type: 'success' },
      { id: '3', user: 'Mike Rodriguez', action: 'Created Custom Sound Mix', timestamp: '12 mins ago', icon: '🎵', type: 'info' },
      { id: '4', user: 'Emma Wilson', action: 'Redeemed Premium Gift Code', timestamp: '25 mins ago', icon: '🎁', type: 'premium' },
      { id: '5', user: 'Alex Thompson', action: 'Downloaded Sleep Report', timestamp: '1 hour ago', icon: '📊', type: 'info' }
    ];
  }

  private formatActivityAction(activityType: string): string {
    const actions: { [key: string]: string } = {
      'user_registered': 'New user registration',
      'subscription_upgraded': 'Upgraded subscription plan',
      'sleep_session_completed': 'Completed sleep session',
      'payment_received': 'Payment processed',
      'gift_code_redeemed': 'Gift code redeemed',
      'sound_played': 'Played premium sound'
    };
    return actions[activityType] || activityType;
  }

  private formatTimestamp(timestamp: string): string {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }

  private getActivityIcon(activityType: string): string {
    const icons: { [key: string]: string } = {
      'user_registered': '👤',
      'subscription_upgraded': '💎',
      'sleep_session_completed': '💤',
      'payment_received': '💰',
      'gift_code_redeemed': '🎁',
      'sound_played': '🎵'
    };
    return icons[activityType] || '📊';
  }

  private getActivityType(activityType: string): 'success' | 'warning' | 'info' | 'premium' {
    if (activityType === 'subscription_upgraded' || activityType === 'payment_received') {
      return 'premium';
    }
    return 'success';
  }

  handleDataLoadError(): void {
    this.isLoading = false;
    // Load fallback data
    this.stats = {
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
    this.loadSampleActivities();
  }

  // Navigation Methods
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToSounds(): void {
    this.router.navigate(['/sounds']);
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  navigateToGiftCodes(): void {
    this.router.navigate(['/gift-codes']);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  navigateToAIStudio(): void {
    this.router.navigate(['/ai-studio']);
  }

  // Dashboard Actions
  refreshData(): void {
    this.isLoading = true;
    this.loadRealData();
  }

  exportDashboardData(): void {
    this.apiService.exportDashboardData().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sleep-tracker-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Export failed:', error);
        alert('Failed to export dashboard data. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Test Admin Login
  testRealAdminLogin(): void {
    const credentials = {
      email: 'admin@admin.com',
      password: 'admin123'
    };

    this.apiService.adminLogin(credentials).subscribe({
      next: (response: any) => {
        if (response.success && response.token) {
          this.apiService.setAuthToken(response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('adminData', JSON.stringify(response.admin));
          this.currentAdmin = response.admin;
          this.loadRealData();
          alert('Admin login successful!');
        }
      },
      error: (error: any) => {
        console.error('Admin login failed:', error);
        alert('Admin login failed. Using public data.');
      }
    });
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  calculateGrowth(current: number, previous: number): string {
    if (previous === 0) return '+0%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  }
}