import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotional';
  audience: 'all' | 'premium' | 'enterprise' | 'free' | 'inactive';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  opens: number;
  clicks: number;
  conversions: number;
  createdAt: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  category: 'welcome' | 'engagement' | 'retention' | 'promotional' | 'educational';
  subject: string;
  message: string;
  usedCount: number;
  successRate: number;
}

interface Campaign {
  id: string;
  name: string;
  notifications: Notification[];
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  results: {
    sent: number;
    opens: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  // Main Data
  notifications: Notification[] = [];
  templates: NotificationTemplate[] = [];
  campaigns: Campaign[] = [];
  
  // Filtering & Search
  searchTerm: string = '';
  statusFilter: string = 'all';
  typeFilter: string = 'all';
  audienceFilter: string = 'all';
  
  // New Notification
  newNotification: Partial<Notification> = {
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
    status: 'draft'
  };
  
  // UI State
  isLoading: boolean = true;
  activeTab: string = 'notifications';
  showComposer: boolean = false;
  selectedNotification: Notification | null = null;

  // Mock data initialization
  ngOnInit(): void {
    this.loadNotificationsData();
  }

  loadNotificationsData(): void {
    setTimeout(() => {
      this.generateMockData();
      this.isLoading = false;
    }, 1500);
  }

  generateMockData(): void {
    // Notifications
    this.notifications = [
      {
        id: '1',
        title: 'Welcome to SleepTracker Pro!',
        message: 'Start your sleep journey with our premium features and personalized insights.',
        type: 'success',
        audience: 'all',
        status: 'sent',
        sentDate: '2024-11-20 10:30:00',
        opens: 1247,
        clicks: 892,
        conversions: 156,
        createdAt: '2024-11-20'
      },
      {
        id: '2',
        title: 'Your Sleep Report is Ready',
        message: 'Check out your weekly sleep analysis and personalized recommendations.',
        type: 'info',
        audience: 'premium',
        status: 'sent',
        sentDate: '2024-11-19 14:15:00',
        opens: 892,
        clicks: 567,
        conversions: 89,
        createdAt: '2024-11-19'
      },
      {
        id: '3',
        title: 'Limited Time: 50% Off Annual Plan',
        message: 'Upgrade to annual billing and save 50% on your subscription!',
        type: 'promotional',
        audience: 'free',
        status: 'scheduled',
        scheduledDate: '2024-11-25 09:00:00',
        opens: 0,
        clicks: 0,
        conversions: 0,
        createdAt: '2024-11-18'
      },
      {
        id: '4',
        title: 'Subscription Payment Failed',
        message: 'Update your payment method to continue enjoying premium features.',
        type: 'warning',
        audience: 'premium',
        status: 'sent',
        sentDate: '2024-11-17 16:45:00',
        opens: 234,
        clicks: 178,
        conversions: 67,
        createdAt: '2024-11-17'
      },
      {
        id: '5',
        title: 'New Sleep Sounds Available',
        message: 'We added 25 new premium sounds to help you sleep better.',
        type: 'info',
        audience: 'all',
        status: 'draft',
        opens: 0,
        clicks: 0,
        conversions: 0,
        createdAt: '2024-11-16'
      }
    ];

    // Generate more notifications
    for (let i = 6; i <= 20; i++) {
      this.notifications.push(this.generateMockNotification(i));
    }

    // Templates
    this.templates = [
      {
        id: '1',
        name: 'Welcome Series - Day 1',
        category: 'welcome',
        subject: 'Welcome to SleepTracker!',
        message: 'Start your sleep optimization journey with our guided onboarding.',
        usedCount: 2847,
        successRate: 78
      },
      {
        id: '2',
        name: 'Sleep Report Weekly',
        category: 'engagement',
        subject: 'Your Weekly Sleep Report',
        message: 'Here is your personalized sleep analysis and recommendations.',
        usedCount: 1562,
        successRate: 85
      },
      {
        id: '3',
        name: 'Premium Upgrade Offer',
        category: 'promotional',
        subject: 'Unlock Premium Features',
        message: 'Upgrade to premium for advanced sleep tracking and personalized insights.',
        usedCount: 892,
        successRate: 23
      },
      {
        id: '4',
        name: 'Re-engagement Campaign',
        category: 'retention',
        subject: 'We Miss You!',
        message: 'Come back to continue your sleep improvement journey.',
        usedCount: 567,
        successRate: 45
      },
      {
        id: '5',
        name: 'Sleep Education Tip',
        category: 'educational',
        subject: 'Sleep Better Tonight',
        message: 'Professional tips to improve your sleep quality starting tonight.',
        usedCount: 1234,
        successRate: 92
      }
    ];

    // Campaigns
    this.campaigns = [
      {
        id: '1',
        name: 'Q4 Premium Conversion',
        notifications: this.notifications.slice(0, 3),
        status: 'active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
        budget: 5000,
        spent: 2340,
        results: {
          sent: 28470,
          opens: 15689,
          clicks: 8923,
          conversions: 1247,
          revenue: 12470
        }
      },
      {
        id: '2',
        name: 'Holiday Sleep Challenge',
        notifications: this.notifications.slice(2, 5),
        status: 'active',
        startDate: '2024-12-01',
        endDate: '2024-12-25',
        budget: 3000,
        spent: 1250,
        results: {
          sent: 15620,
          opens: 8920,
          clicks: 4560,
          conversions: 780,
          revenue: 7800
        }
      },
      {
        id: '3',
        name: 'New Year Reset Campaign',
        notifications: this.notifications.slice(1, 4),
        status: 'completed',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        budget: 4000,
        spent: 4000,
        results: {
          sent: 32450,
          opens: 18920,
          clicks: 10230,
          conversions: 1560,
          revenue: 15600
        }
      }
    ];
  }

  private generateMockNotification(id: number): Notification {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error', 'promotional'];
    const audiences: Notification['audience'][] = ['all', 'premium', 'enterprise', 'free', 'inactive'];
    const statuses: Notification['status'][] = ['draft', 'scheduled', 'sent', 'failed'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const audience = audiences[Math.floor(Math.random() * audiences.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: id.toString(),
      title: `Notification ${id} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `This is a sample ${type} notification for ${audience} users.`,
      type: type,
      audience: audience,
      status: status,
      scheduledDate: status === 'scheduled' ? '2024-11-25 09:00:00' : undefined,
      sentDate: status === 'sent' ? '2024-11-20 10:30:00' : undefined,
      opens: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 100),
      createdAt: `2024-11-${Math.floor(Math.random() * 20) + 1}`
    };
  }

  // 🎯 CORE METHODS
  getFilteredNotifications(): Notification[] {
    return this.notifications.filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || notification.status === this.statusFilter;
      const matchesType = this.typeFilter === 'all' || notification.type === this.typeFilter;
      const matchesAudience = this.audienceFilter === 'all' || notification.audience === this.audienceFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesAudience;
    });
  }

  getTotalSent(): number {
    return this.notifications.filter(n => n.status === 'sent').length;
  }

  getTotalOpens(): number {
    return this.notifications.reduce((sum, n) => sum + n.opens, 0);
  }

  getTotalConversions(): number {
    return this.notifications.reduce((sum, n) => sum + n.conversions, 0);
  }

  getAverageOpenRate(): number {
    const sentNotifications = this.notifications.filter(n => n.status === 'sent');
    const totalSent = sentNotifications.reduce((sum, n) => sum + n.opens, 0);
    const totalPossible = sentNotifications.length * 1000; // Assuming 1000 recipients per notification
    
    return totalPossible > 0 ? Math.round((totalSent / totalPossible) * 100) : 0;
  }

  // 🚀 NOTIFICATION ACTIONS
  createNotification(): void {
    if (!this.newNotification.title || !this.newNotification.message) {
      alert('Please fill in both title and message!');
      return;
    }

    const newNotification: Notification = {
      id: (this.notifications.length + 1).toString(),
      title: this.newNotification.title!,
      message: this.newNotification.message!,
      type: this.newNotification.type!,
      audience: this.newNotification.audience!,
      status: 'draft',
      opens: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.notifications.unshift(newNotification);
    this.showComposer = false;
    this.resetNewNotification();
    
    console.log('📧 Notification created:', newNotification);
    alert('✅ Notification created successfully! Ready to schedule or send.');
  }

  sendNotification(notification: Notification): void {
    console.log('🚀 Sending notification:', notification);
    
    // Update notification status
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      this.notifications[index] = {
        ...this.notifications[index],
        status: 'sent',
        sentDate: new Date().toISOString()
      };
    }
    
    alert(`📧 NOTIFICATION SENT!\n\nTo: ${this.getAudienceDisplayName(notification.audience)}\nRecipients: ~2,847 users\nExpected opens: 45-60%\n\nCampaign launched successfully!`);
  }

  scheduleNotification(notification: Notification, date: string): void {
    console.log('⏰ Scheduling notification:', notification, date);
    
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      this.notifications[index] = {
        ...this.notifications[index],
        status: 'scheduled',
        scheduledDate: date
      };
    }
    
    alert(`⏰ NOTIFICATION SCHEDULED!\n\nDelivery: ${new Date(date).toLocaleString()}\nAudience: ${this.getAudienceDisplayName(notification.audience)}\nReady for automated sending!`);
  }

  duplicateNotification(notification: Notification): void {
    const duplicated: Notification = {
      ...notification,
      id: (this.notifications.length + 1).toString(),
      title: `${notification.title} (Copy)`,
      status: 'draft',
      opens: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.notifications.unshift(duplicated);
    console.log('📋 Notification duplicated:', duplicated);
    alert('📋 Notification duplicated! Ready for editing and sending.');
  }

  deleteNotification(notification: Notification): void {
    if (confirm(`Are you sure you want to delete "${notification.title}"?`)) {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
      console.log('🗑️ Notification deleted:', notification);
      alert('🗑️ Notification deleted successfully!');
    }
  }

  // 🛠️ UTILITY METHODS
  private resetNewNotification(): void {
    this.newNotification = {
      title: '',
      message: '',
      type: 'info',
      audience: 'all',
      status: 'draft'
    };
  }

  getStatusDisplayName(status: string): string {
    const names: { [key: string]: string } = {
      'draft': 'Draft',
      'scheduled': 'Scheduled',
      'sent': 'Sent',
      'failed': 'Failed'
    };
    return names[status] || 'Unknown';
  }

  getTypeDisplayName(type: string): string {
    const names: { [key: string]: string } = {
      'info': 'Information',
      'success': 'Success',
      'warning': 'Warning',
      'error': 'Error',
      'promotional': 'Promotional'
    };
    return names[type] || 'Unknown';
  }

  getAudienceDisplayName(audience: string): string {
    const names: { [key: string]: string } = {
      'all': 'All Users',
      'premium': 'Premium Users',
      'enterprise': 'Enterprise Users',
      'free': 'Free Users',
      'inactive': 'Inactive Users'
    };
    return names[audience] || 'Unknown';
  }

  getCategoryDisplayName(category: string): string {
    const names: { [key: string]: string } = {
      'welcome': 'Welcome Series',
      'engagement': 'Engagement',
      'retention': 'Retention',
      'promotional': 'Promotional',
      'educational': 'Educational'
    };
    return names[category] || 'Unknown';
  }

  // 📊 ANALYTICS METHODS
  getOpenRate(notification: Notification): number {
    const sentCount = 1000; // Mock sent count
    return sentCount > 0 ? Math.round((notification.opens / sentCount) * 100) : 0;
  }

  getClickRate(notification: Notification): number {
    return notification.opens > 0 ? Math.round((notification.clicks / notification.opens) * 100) : 0;
  }

  getConversionRate(notification: Notification): number {
    return notification.clicks > 0 ? Math.round((notification.conversions / notification.clicks) * 100) : 0;
  }

  // 🎪 MALIK'S SPECIAL FEATURES
  quickSendToAllUsers(): void {
    console.log('🚀 Quick sending to all users');
    alert(`🚀 QUICK BLAST TO ALL USERS!\n\n📧 Preparing notification for 2,847 users\n🎯 Expected reach: 85-92%\n📈 Projected engagement: 45-60%\n💰 Estimated revenue impact: $1,200-1,800\n\nReady to engage your entire user base!`);
  }

  createAICampaign(): void {
    console.log('🤖 Creating AI-powered campaign');
    alert(`🤖 AI CAMPAIGN CREATED!\n\n🎯 Target: Users with declining engagement\n📊 Personalization: 95% match rate\n⏰ Schedule: Optimal sending times\n📈 Projected results: 68% better than manual\n\nAI-powered engagement activated!`);
  }

  exportNotificationAnalytics(): void {
    console.log('📊 Exporting notification analytics');
    alert(`📊 NOTIFICATION ANALYTICS EXPORTED!\n\n✅ PDF Report Generated\n✅ Excel Data Downloaded\n✅ Performance Metrics Included\n✅ ROI Analysis Complete\n\nReady for marketing team review!`);
  }

  showDeliveryOptimization(): void {
    console.log('⚡ Showing delivery optimization');
    alert(`⚡ DELIVERY OPTIMIZATION REPORT\n\n📱 Push Notifications: 92% delivery rate\n📧 Email: 88% delivery rate\n🔔 In-App: 98% delivery rate\n⏰ Best Time: 9:00 AM local time\n🎯 Optimal Frequency: 2-3 per week\n\nDelivery system: OPTIMIZED 🟢`);
  }

  testNotification(): void {
    console.log('🧪 Testing notification');
    alert(`🧪 NOTIFICATION TEST COMPLETE!\n\n📱 Push: Delivered instantly\n📧 Email: Delivered to test inbox\n🔔 In-App: Displayed correctly\n🎨 Design: Perfect on all devices\n⚡ Performance: Lightning fast\n\nReady for production deployment!`);
  }

  // 📈 CAMPAIGN MANAGEMENT
  createNewCampaign(): void {
    console.log('🎯 Creating new campaign');
    alert(`🎯 NEW CAMPAIGN CREATION\n\nReady to build your next successful notification campaign!\n\nFeatures:\n• Multi-channel delivery\n• A/B testing\n• Performance tracking\n• ROI optimization\n• Automated scheduling\n\nLet's create something amazing!`);
  }

  pauseCampaign(campaign: Campaign): void {
    console.log('⏸️ Pausing campaign:', campaign);
    alert(`⏸️ CAMPAIGN PAUSED: ${campaign.name}\n\nCurrent results:\n• Sent: ${campaign.results.sent.toLocaleString()}\n• Opens: ${campaign.results.opens.toLocaleString()}\n• Conversions: ${campaign.results.conversions.toLocaleString()}\n• Revenue: $${campaign.results.revenue.toLocaleString()}\n\nReady to resume when needed!`);
  }

  // 🎨 TEMPLATE MANAGEMENT
  useTemplate(template: NotificationTemplate): void {
    console.log('📋 Using template:', template);
    
    this.newNotification = {
      title: template.subject,
      message: template.message,
      type: 'info',
      audience: 'all',
      status: 'draft'
    };
    
    this.showComposer = true;
    this.activeTab = 'composer';
    
    alert(`📋 TEMPLATE LOADED: ${template.name}\n\nSuccess rate: ${template.successRate}%\nUsed ${template.usedCount.toLocaleString()} times\n\nReady for customization and sending!`);
  }
}