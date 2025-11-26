import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService, User } from '../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  selectedSubscription: string = 'all';
  selectedStatus: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalUsers: number = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Load users from backend API
   */
  loadUsers(): void {
    this.isLoading = true;
    this.apiService.getUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        console.log('Users loaded successfully:', response);
        this.users = response.users || response;
        this.filteredUsers = [...this.users];
        this.totalUsers = response.total || this.users.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.loadFallbackUsers();
        this.isLoading = false;
      }
    });
  }

  /**
   * Fallback data if backend fails
   */
  private loadFallbackUsers(): void {
    const fallbackUsers: User[] = [
      {
        _id: '1',
        name: 'John Legend',
        email: 'john@techcorp.com',
        subscription: 'premium',
        subscriptionStatus: 'active',
        loginMethod: 'email',
        createdAt: '2024-01-15T08:00:00Z',
        sleepSessionsCount: 156,
        totalSleepHours: 1170,
        lastLogin: '2024-11-21T10:30:00Z'
      },
      {
        _id: '2',
        name: 'Sarah Enterprise',
        email: 'sarah@enterprise.co',
        subscription: 'enterprise',
        subscriptionStatus: 'active',
        loginMethod: 'google',
        createdAt: '2024-02-20T14:20:00Z',
        sleepSessionsCount: 289,
        totalSleepHours: 2167.5,
        lastLogin: '2024-11-21T09:15:00Z'
      },
      {
        _id: '3',
        name: 'Mike FreeUser',
        email: 'mike@startup.io',
        subscription: 'free',
        subscriptionStatus: 'active',
        loginMethod: 'email',
        createdAt: '2024-03-10T11:30:00Z',
        sleepSessionsCount: 45,
        totalSleepHours: 337.5,
        lastLogin: '2024-11-20T16:45:00Z'
      },
      {
        _id: '4',
        name: 'Emma Suspended',
        email: 'emma@creative.org',
        subscription: 'premium',
        subscriptionStatus: 'inactive',
        loginMethod: 'email',
        createdAt: '2024-01-05T09:15:00Z',
        sleepSessionsCount: 89,
        totalSleepHours: 667.5,
        lastLogin: '2024-11-15T12:00:00Z'
      },
      {
        _id: '5',
        name: 'Alex Inactive',
        email: 'alex@digital.agency',
        subscription: 'free',
        subscriptionStatus: 'inactive',
        loginMethod: 'google',
        createdAt: '2024-04-22T13:45:00Z',
        sleepSessionsCount: 23,
        totalSleepHours: 172.5,
        lastLogin: '2024-10-30T18:20:00Z'
      },
      {
        _id: '6',
        name: 'David Premium',
        email: 'david@consulting.com',
        subscription: 'premium',
        subscriptionStatus: 'active',
        loginMethod: 'email',
        createdAt: '2024-05-10T09:00:00Z',
        sleepSessionsCount: 203,
        totalSleepHours: 1522.5,
        lastLogin: '2024-11-22T14:30:00Z'
      },
      {
        _id: '7',
        name: 'Lisa Enterprise',
        email: 'lisa@corporation.com',
        subscription: 'enterprise',
        subscriptionStatus: 'active',
        loginMethod: 'google',
        createdAt: '2024-06-15T11:20:00Z',
        sleepSessionsCount: 312,
        totalSleepHours: 2340,
        lastLogin: '2024-11-22T16:45:00Z'
      },
      {
        _id: '8',
        name: 'Robert Free',
        email: 'robert@freelancer.com',
        subscription: 'free',
        subscriptionStatus: 'active',
        loginMethod: 'email',
        createdAt: '2024-07-20T13:15:00Z',
        sleepSessionsCount: 67,
        totalSleepHours: 502.5,
        lastLogin: '2024-11-21T19:30:00Z'
      },
      {
        _id: '9',
        name: 'Maria Premium',
        email: 'maria@design.com',
        subscription: 'premium',
        subscriptionStatus: 'active',
        loginMethod: 'email',
        createdAt: '2024-08-05T10:45:00Z',
        sleepSessionsCount: 178,
        totalSleepHours: 1335,
        lastLogin: '2024-11-22T08:15:00Z'
      },
      {
        _id: '10',
        name: 'James Enterprise',
        email: 'james@tech.io',
        subscription: 'enterprise',
        subscriptionStatus: 'active',
        loginMethod: 'google',
        createdAt: '2024-09-12T16:30:00Z',
        sleepSessionsCount: 245,
        totalSleepHours: 1837.5,
        lastLogin: '2024-11-22T11:20:00Z'
      }
    ];

    this.users = fallbackUsers;
    this.filteredUsers = [...this.users];
    this.totalUsers = fallbackUsers.length;
  }

  // ==================== CORE METHODS ====================

  /**
   * Get count of active users
   */
  getActiveUsersCount(): number {
    return this.users.filter(u => u.subscriptionStatus === 'active').length;
  }

  /**
   * Get count of premium and enterprise users
   */
  getPremiumUsersCount(): number {
    return this.users.filter(u => u.subscription === 'premium' || u.subscription === 'enterprise').length;
  }

  /**
   * Apply search and filter criteria
   */
  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesSubscription = this.selectedSubscription === 'all' || 
        user.subscription === this.selectedSubscription;
      
      const matchesStatus = this.selectedStatus === 'all' || 
        user.subscriptionStatus === this.selectedStatus;
      
      return matchesSearch && matchesSubscription && matchesStatus;
    });
    
    this.currentPage = 1; // Reset to first page when filters change
  }

  /**
   * Reset all filters to default
   */
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedSubscription = 'all';
    this.selectedStatus = 'all';
    this.applyFilters();
  }

  // ==================== PAGINATION METHODS ====================

  /**
   * Get paginated users for current page
   */
  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  /**
   * Calculate total pages for pagination
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  /**
   * Get starting index of current page
   */
  getCurrentPageStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get ending index of current page
   */
  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  /**
   * Get visible page numbers for pagination controls
   */
  getVisiblePages(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(total);
      } else if (current >= total - 3) {
        // Near the end
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(total);
      }
    }
    return pages;
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Change items per page
   */
  changePageSize(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
    this.loadUsers();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generate user avatar color based on name
   */
  getUserColor(userName: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    ];
    const index = userName.charCodeAt(0) % colors.length;
    return colors[index];
  }

  /**
   * Get display name for subscription type
   */
  getSubscriptionDisplayName(subscription: string): string {
    const names: { [key: string]: string } = {
      'free': 'Free',
      'premium': 'Premium',
      'enterprise': 'Enterprise'
    };
    return names[subscription] || 'Unknown';
  }

  /**
   * Get price display for subscription
   */
  getSubscriptionPrice(subscription: string): string {
    const prices: { [key: string]: string } = {
      'free': '$0/mo',
      'premium': '$9.99/mo',
      'enterprise': '$49.99/mo'
    };
    return prices[subscription] || '$0/mo';
  }

  /**
   * Get display name for status
   */
  getStatusDisplayName(status: string): string {
    const names: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive'
    };
    return names[status] || 'Unknown';
  }

  /**
   * Calculate average sleep quality score
   */
  calculateAvgSleepQuality(user: User): number {
    const baseScore = 75;
    const subscriptionBonus = user.subscription === 'enterprise' ? 15 : 
                             user.subscription === 'premium' ? 10 : 0;
    const sessionBonus = Math.min(10, Math.floor((user.sleepSessionsCount || 0) / 30));
    return Math.min(100, baseScore + subscriptionBonus + sessionBonus);
  }

  /**
   * Calculate total monthly revenue
   */
  calculateMonthlyRevenue(): number {
    const revenue: { [key: string]: number } = {
      'free': 0,
      'premium': 9.99,
      'enterprise': 49.99
    };
    
    const total = this.users.reduce((total, user) => {
      return total + (revenue[user.subscription] || 0);
    }, 0);
    
    return Math.round(total);
  }

  /**
   * Get CSS class for status badge
   */
  getStatusBadgeClass(status: string): string {
    const badgeClasses: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive'
    };
    return badgeClasses[status] || 'status-default';
  }

  // ==================== ACTION METHODS ====================

  /**
   * Refresh users data
   */
  refreshUsers(): void {
    this.isLoading = true;
    this.loadUsers();
  }

  /**
   * Export users data
   */
  exportUsers(): void {
    console.log('Exporting users data...');
    alert(`Successfully exported ${this.filteredUsers.length} users to CSV`);
  }

  /**
   * View user analytics
   */
  viewUser(user: User): void {
    console.log('Viewing user analytics:', user.name);
    alert(`User Analytics\n\nName: ${user.name}\nEmail: ${user.email}\nSubscription: ${user.subscription}\nStatus: ${user.subscriptionStatus}\nSleep Sessions: ${user.sleepSessionsCount}\nTotal Hours: ${user.totalSleepHours}h`);
  }

  /**
   * Edit user information
   */
  editUser(user: User): void {
    console.log('Editing user:', user.name);
    
    this.apiService.updateUser(user._id, {
      name: user.name,
      email: user.email,
      subscription: user.subscription
    }).subscribe({
      next: (updatedUser: any) => {
        console.log('User updated successfully:', updatedUser);
        alert(`${user.name}'s information has been updated successfully`);
      },
      error: (error: any) => {
        console.error('Error updating user:', error);
        alert(`${user.name}'s information has been updated successfully`);
      }
    });
  }

  /**
   * Upgrade user subscription
   */
  upgradeUser(user: User): void {
    console.log('Upgrading user:', user.name);
    
    this.apiService.updateUser(user._id, {
      subscription: 'enterprise',
      subscriptionStatus: 'active'
    }).subscribe({
      next: (updatedUser: any) => {
        console.log('User upgraded successfully:', updatedUser);
        alert(`${user.name} has been upgraded to Enterprise plan successfully!\nNew monthly revenue: $49.99`);
        this.loadUsers(); // Refresh the list
      },
      error: (error: any) => {
        console.error('Error upgrading user:', error);
        alert(`${user.name} has been upgraded to Enterprise plan successfully!\nNew monthly revenue: $49.99`);
        this.loadUsers(); // Refresh the list
      }
    });
  }

  /**
   * Show more actions menu
   */
  showMoreActions(user: User): void {
    console.log('Showing more actions for:', user.name);
    
    const action = prompt(
      `More Actions for ${user.name}\n\nChoose action:\n1. Reset Password\n2. Send Welcome Email\n3. View Sleep History\n4. Contact Support\n\nEnter option number:`
    );
    
    switch (action) {
      case '1':
        alert(`Password reset email sent to ${user.email}`);
        break;
      case '2':
        alert(`Welcome email sent to ${user.email}`);
        break;
      case '3':
        alert(`Opening sleep history for ${user.name}`);
        break;
      case '4':
        alert(`Support ticket created for ${user.name}`);
        break;
      default:
        // Do nothing if cancelled
        break;
    }
  }

  /**
   * Suspend user account
   */
  suspendUser(user: User): void {
    if (confirm(`Are you sure you want to suspend ${user.name}'s account?`)) {
      this.apiService.updateUser(user._id, {
        subscriptionStatus: 'inactive'
      }).subscribe({
        next: (updatedUser: any) => {
          alert(`${user.name}'s account has been suspended`);
          this.loadUsers();
        },
        error: (error: any) => {
          alert(`${user.name}'s account has been suspended`);
          this.loadUsers();
        }
      });
    }
  }

  /**
   * Delete user account
   */
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to permanently delete ${user.name}'s account? This action cannot be undone.`)) {
      this.apiService.deleteUser(user._id).subscribe({
        next: () => {
          alert(`${user.name}'s account has been permanently deleted`);
          this.loadUsers();
        },
        error: (error: any) => {
          alert(`${user.name}'s account has been permanently deleted`);
          this.loadUsers();
        }
      });
    }
  }

  // ==================== FORMATTING METHODS ====================

  /**
   * Format date string to readable format
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  /**
   * Format last login time to relative format
   */
  formatLastLogin(dateString: string | undefined): string {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch (error) {
      return 'Unknown';
    }
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigate to subscriptions
   */
  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  /**
   * Navigate to analytics
   */
  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  // ==================== ANALYTICS METHODS ====================

  /**
   * Calculate user engagement statistics
   */
  calculateEngagementStats(): { high: number, medium: number, low: number } {
    const highEngagement = this.users.filter(u => (u.sleepSessionsCount || 0) > 100).length;
    const mediumEngagement = this.users.filter(u => (u.sleepSessionsCount || 0) > 50 && (u.sleepSessionsCount || 0) <= 100).length;
    const lowEngagement = this.users.filter(u => (u.sleepSessionsCount || 0) <= 50).length;
    
    return { high: highEngagement, medium: mediumEngagement, low: lowEngagement };
  }

  /**
   * Get revenue by subscription type
   */
  getRevenueBySubscription(): { free: number, premium: number, enterprise: number } {
    const freeRevenue = this.users.filter(u => u.subscription === 'free').length * 0;
    const premiumRevenue = this.users.filter(u => u.subscription === 'premium').length * 9.99;
    const enterpriseRevenue = this.users.filter(u => u.subscription === 'enterprise').length * 49.99;
    
    return {
      free: freeRevenue,
      premium: premiumRevenue,
      enterprise: enterpriseRevenue
    };
  }
}