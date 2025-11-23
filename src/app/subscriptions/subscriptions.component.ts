import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'premium' | 'enterprise';
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  description: string;
  activeUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
  status: 'active' | 'draft' | 'archived';
  popular?: boolean;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  amount: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  created: string;
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPlan: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRevenue: number = 0;
  activeSubscriptions: number = 0;
  trialUsers: number = 0;
  churnRate: number = 4.2;

  // 🎯 MOCK DATA - REVENUE GENERATING MACHINE
  private mockPlans: SubscriptionPlan[] = [
    {
      id: '1',
      name: 'Free Forever',
      type: 'free',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [
        'Basic Sleep Tracking',
        '5 Sleep Sounds',
        '7-Day History',
        'Community Support'
      ],
      description: 'Perfect for getting started with sleep tracking',
      activeUsers: 2547,
      monthlyRevenue: 0,
      conversionRate: 18,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sleep Pro',
      type: 'premium',
      price: 12.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Advanced Analytics',
        '260+ Sleep Sounds',
        'Unlimited History',
        'Personalized Recommendations',
        'Priority Support',
        'No Ads'
      ],
      description: 'Unlock premium features for better sleep',
      activeUsers: 1245,
      monthlyRevenue: 16158.55,
      conversionRate: 32,
      status: 'active',
      popular: true
    },
    {
      id: '3',
      name: 'Enterprise Suite',
      type: 'enterprise',
      price: 49.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Team Management',
        'Advanced Reporting',
        'Dedicated Support',
        'Custom Integrations',
        'API Access',
        'White-label Solution'
      ],
      description: 'Complete sleep solution for organizations',
      activeUsers: 67,
      monthlyRevenue: 3349.33,
      conversionRate: 12,
      status: 'active'
    }
  ];

  private mockSubscriptions: Subscription[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Smith',
      userEmail: 'john@techcorp.com',
      planId: '2',
      planName: 'Sleep Pro',
      status: 'active',
      amount: 12.99,
      currency: 'USD',
      currentPeriodStart: '2024-11-01',
      currentPeriodEnd: '2024-12-01',
      cancelAtPeriodEnd: false,
      created: '2024-10-15'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@designstudio.com',
      planId: '2',
      planName: 'Sleep Pro',
      status: 'active',
      amount: 12.99,
      currency: 'USD',
      currentPeriodStart: '2024-11-05',
      currentPeriodEnd: '2024-12-05',
      cancelAtPeriodEnd: false,
      created: '2024-10-20'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Wilson',
      userEmail: 'mike@startup.io',
      planId: '3',
      planName: 'Enterprise Suite',
      status: 'trialing',
      amount: 49.99,
      currency: 'USD',
      currentPeriodStart: '2024-10-15',
      currentPeriodEnd: '2024-11-15',
      cancelAtPeriodEnd: true,
      created: '2024-09-01'
    }
  ];

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    setTimeout(() => {
      // Generate more subscriptions
      const additionalSubscriptions: Subscription[] = [];
      for (let i = 4; i <= 25; i++) {
        additionalSubscriptions.push(this.generateMockSubscription(i));
      }

      this.plans = [...this.mockPlans];
      this.subscriptions = [...this.mockSubscriptions, ...additionalSubscriptions];
      this.filteredSubscriptions = [...this.subscriptions];
      this.calculateStats();
      this.isLoading = false;
    }, 1200);
  }

  private generateMockSubscription(id: number): Subscription {
    const plans = ['Free Forever', 'Sleep Pro', 'Enterprise Suite'];
    const statuses: Subscription['status'][] = ['active', 'active', 'active', 'canceled', 'past_due', 'trialing'];
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: id.toString(),
      userId: `user${id}`,
      userName: `User ${id}`,
      userEmail: `user${id}@example.com`,
      planId: (Math.floor(Math.random() * 3) + 1).toString(),
      planName: plan,
      status: status,
      amount: plan === 'Enterprise Suite' ? 49.99 : plan === 'Sleep Pro' ? 12.99 : 0,
      currency: 'USD',
      currentPeriodStart: `2024-11-${Math.floor(Math.random() * 20) + 1}`,
      currentPeriodEnd: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
      cancelAtPeriodEnd: Math.random() > 0.7,
      created: `2024-10-${Math.floor(Math.random() * 30) + 1}`
    };
  }

  private calculateStats(): void {
    this.totalRevenue = this.subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0);

    this.activeSubscriptions = this.subscriptions.filter(sub => sub.status === 'active').length;
    this.trialUsers = this.subscriptions.filter(sub => sub.status === 'trialing').length;
  }

  // 🎯 CORE STATS METHODS
  getTotalRevenue(): number {
    return this.plans.reduce((total, plan) => total + plan.monthlyRevenue, 0);
  }

  getTotalUsers(): number {
    return this.plans.reduce((total, plan) => total + plan.activeUsers, 0);
  }

  getTrialUsersCount(): number {
    return this.trialUsers;
  }

  getAverageConversionRate(): number {
    const total = this.plans.reduce((sum, plan) => sum + plan.conversionRate, 0);
    return Math.round(total / this.plans.length);
  }

  // 🎯 FILTERING METHODS
  getFilteredSubscriptions(): Subscription[] {
    return this.subscriptions.filter(subscription => {
      const matchesSearch = 
        subscription.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subscription.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || subscription.status === this.selectedStatus;
      const matchesPlan = this.selectedPlan === 'all' || subscription.planName === this.selectedPlan;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }

  getStatusDisplayName(status: string): string {
    const names: { [key: string]: string } = {
      'active': 'Active',
      'canceled': 'Canceled',
      'past_due': 'Past Due',
      'trialing': 'Trialing'
    };
    return names[status] || 'Unknown';
  }

  getPlanDisplayName(plan: string): string {
    const names: { [key: string]: string } = {
      'Free Forever': 'Free',
      'Sleep Pro': 'Pro',
      'Enterprise Suite': 'Enterprise'
    };
    return names[plan] || plan;
  }

  // 🆕 ADDED: Plan class method
  getPlanClass(planName: string): string {
    const classMap: { [key: string]: string } = {
      'Free Forever': 'free',
      'Sleep Pro': 'pro', 
      'Enterprise Suite': 'enterprise'
    };
    return classMap[planName] || 'free';
  }

  // 🆕 ADDED: Status class method
  getStatusClass(status: string): string {
    return status;
  }

  // 🆕 ADDED: Date utility methods
  isUrgent(date: string): boolean {
    const billDate = new Date(date);
    const today = new Date();
    const diffTime = billDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }

  getDaysUntil(date: string): string {
    const billDate = new Date(date);
    const today = new Date();
    const diffTime = billDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays < 0) return 'overdue';
    return `in ${diffDays} days`;
  }

  // 🚀 BUSINESS ACTIONS
  createNewPlan(): void {
    console.log('🎯 Creating new subscription plan');
    alert('🎯 NEW PLAN CREATION\n\nReady to create the next revenue-generating subscription plan!\n\nFeatures:\n• Custom pricing\n• Feature packages\n• Trial periods\n• Revenue optimization\n\nLet\'s build something amazing!');
  }

  editPlan(plan: SubscriptionPlan): void {
    console.log('✏️ Editing plan:', plan);
    alert(`✏️ EDITING PLAN: ${plan.name}\n\nReady to optimize this revenue stream!\n\nCurrent stats:\n• ${plan.activeUsers} active users\n• $${plan.monthlyRevenue} monthly revenue\n• ${plan.conversionRate}% conversion rate\n\nLet\'s make it even better!`);
  }

  viewPlanAnalytics(plan: SubscriptionPlan): void {
    console.log('📊 Viewing plan analytics:', plan);
    alert(`📊 PLAN ANALYTICS: ${plan.name}\n\n💰 Monthly Revenue: $${plan.monthlyRevenue}\n👥 Active Users: ${plan.activeUsers}\n📈 Conversion Rate: ${plan.conversionRate}%\n🎯 Status: ${plan.status}\n\nRevenue engine: ${plan.monthlyRevenue > 5000 ? 'OPTIMAL 🟢' : 'NEEDS OPTIMIZATION 🟡'}`);
  }

  upgradeUserPlan(subscription: Subscription): void {
    console.log('🚀 Upgrading user plan:', subscription);
    alert(`🚀 UPGRADE USER PLAN\n\nUser: ${subscription.userName}\nCurrent: ${subscription.planName}\nReady for premium upgrade!\n\nExpected revenue increase: $${subscription.amount === 0 ? 12.99 : 37}\nProjected conversion: 85%\n\nLet\'s boost that revenue!`);
  }

  // 💰 REVENUE OPTIMIZATION FEATURES
  exportRevenueReport(): void {
    console.log('📊 Exporting revenue report');
    alert(`📊 REVENUE REPORT EXPORTED\n\n✅ PDF Report Generated\n✅ Excel Data Exported\n✅ Revenue Analytics Included\n✅ Subscription Metrics\n\nReady for finance team review!`);
  }

  showRevenueForecast(): void {
    console.log('🔮 Showing revenue forecast');
    const forecast = this.getTotalRevenue() * 1.3; // 30% growth
    alert(`🔮 REVENUE FORECAST\n\n📈 Next Month: $${(this.getTotalRevenue() * 1.15).toFixed(2)}\n💰 Next Quarter: $${(this.getTotalRevenue() * 1.3).toFixed(2)}\n🎯 Next Year: $${(this.getTotalRevenue() * 2.1).toFixed(2)}\n\n🚀 Growth Trajectory: ACCELERATING`);
  }

  optimizePricingStrategy(): void {
    console.log('⚡ Optimizing pricing strategy');
    alert(`⚡ PRICING OPTIMIZATION\n\nCurrent ARPU: $${(this.getTotalRevenue() / this.getTotalUsers()).toFixed(2)}\nRecommended Actions:\n• Premium plan: $14.99 (+15%)\n• Enterprise plan: $59.99 (+20%)\n• Introduce annual billing\n• Add premium features\n\nProjected revenue increase: 45%`);
  }

  // 🎪 MALIK'S SPECIAL FEATURES
  runChurnAnalysis(): void {
    console.log('📉 Running churn analysis');
    alert(`📉 CHURN ANALYSIS COMPLETE\n\nCurrent Churn Rate: ${this.churnRate}%\nAt-Risk Users: ${Math.round(this.activeSubscriptions * 0.15)}\nRetention Opportunities: ${Math.round(this.activeSubscriptions * 0.25)}\n\nRecommended Actions:\n• Proactive outreach\n• Feature education\n• Loyalty rewards\n• Exit surveys`);
  }

  launchPromotionalCampaign(): void {
    console.log('🎁 Launching promotional campaign');
    alert(`🎁 PROMOTIONAL CAMPAIGN LAUNCHED\n\nTarget: ${this.trialUsers} trial users\nOffer: 25% discount on annual plan\nDuration: 7 days\nExpected Conversions: ${Math.round(this.trialUsers * 0.35)}\nProjected Revenue: $${(this.trialUsers * 0.35 * 116.91).toFixed(2)}`);
  }
}