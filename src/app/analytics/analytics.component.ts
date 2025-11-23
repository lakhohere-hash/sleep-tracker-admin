import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AnalyticsMetric {
  title: string;
  value: number | string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
  format: 'number' | 'currency' | 'percentage' | 'duration';
}

interface UserGrowth {
  date: string;
  newUsers: number;
  returningUsers: number;
  totalUsers: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  growth: number;
}

interface SleepMetrics {
  date: string;
  avgDuration: number;
  avgQuality: number;
  sessions: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  isLoading: boolean = true;
  timeRange: string = '30d';

  // Core Metrics
  metrics: AnalyticsMetric[] = [];

  // Chart Data
  userGrowthData: UserGrowth[] = [];
  revenueData: RevenueData[] = [];
  sleepMetricsData: SleepMetrics[] = [];

  // Real-time Stats
  realTimeStats = {
    activeUsers: 0,
    currentSessions: 0,
    revenueToday: 0,
    appDownloads: 0
  };

  // Mock data initialization
  ngOnInit(): void {
    this.loadAnalyticsData();
    this.startRealTimeUpdates();
  }

  loadAnalyticsData(): void {
    setTimeout(() => {
      this.generateMockData();
      this.isLoading = false;
    }, 2000);
  }

  generateMockData(): void {
    // Core Metrics
    this.metrics = [
      {
        title: 'Monthly Active Users',
        value: 2847,
        change: '+12.5%',
        trend: 'up',
        icon: '👥',
        color: 'blue',
        format: 'number'
      },
      {
        title: 'Monthly Recurring Revenue',
        value: 9842.50,
        change: '+28.3%',
        trend: 'up',
        icon: '💰',
        color: 'green',
        format: 'currency'
      },
      {
        title: 'Avg Sleep Duration',
        value: 7.2,
        change: '+8.2%',
        trend: 'up',
        icon: '⏱️',
        color: 'purple',
        format: 'duration'
      },
      {
        title: 'Sleep Quality Score',
        value: 86,
        change: '+5.1%',
        trend: 'up',
        icon: '⭐',
        color: 'orange',
        format: 'percentage'
      },
      {
        title: 'User Retention Rate',
        value: 78,
        change: '+3.4%',
        trend: 'up',
        icon: '📊',
        color: 'teal',
        format: 'percentage'
      },
      {
        title: 'Churn Rate',
        value: 4.2,
        change: '-12.8%',
        trend: 'down',
        icon: '📉',
        color: 'red',
        format: 'percentage'
      }
    ];

    // User Growth Data (Last 30 days)
    this.userGrowthData = this.generateUserGrowthData();

    // Revenue Data (Last 12 months)
    this.revenueData = this.generateRevenueData();

    // Sleep Metrics (Last 7 days)
    this.sleepMetricsData = this.generateSleepMetricsData();

    // Real-time Stats
    this.realTimeStats = {
      activeUsers: 247,
      currentSessions: 89,
      revenueToday: 342.50,
      appDownloads: 45
    };
  }

  private generateUserGrowthData(): UserGrowth[] {
    const data: UserGrowth[] = [];
    const baseDate = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        newUsers: Math.floor(Math.random() * 30) + 10,
        returningUsers: Math.floor(Math.random() * 100) + 150,
        totalUsers: 2500 + (i * 12) + Math.floor(Math.random() * 20)
      });
    }
    return data;
  }

  private generateRevenueData(): RevenueData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: RevenueData[] = [];
    let revenue = 5000;
    months.forEach(month => {
      const growth = Math.random() * 0.3 + 0.1; // 10-40% growth
      revenue *= (1 + growth);
      data.push({
        month: month,
        revenue: Math.round(revenue),
        growth: Math.round(growth * 100)
      });
    });
    return data;
  }

  private generateSleepMetricsData(): SleepMetrics[] {
    const data: SleepMetrics[] = [];
    const baseDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        avgDuration: 6.8 + Math.random() * 1.2,
        avgQuality: 80 + Math.random() * 15,
        sessions: Math.floor(Math.random() * 50) + 150
      });
    }
    return data;
  }

  // 🎯 CORE ANALYTICS METHODS
  getTotalUsers(): number {
    return this.userGrowthData[this.userGrowthData.length - 1]?.totalUsers || 0;
  }

  getTotalRevenue(): number {
    return this.revenueData.reduce((sum, month) => sum + month.revenue, 0);
  }

  getAverageSleepDuration(): number {
    const total = this.sleepMetricsData.reduce((sum, day) => sum + day.avgDuration, 0);
    return total / this.sleepMetricsData.length;
  }

  getAverageSleepQuality(): number {
    const total = this.sleepMetricsData.reduce((sum, day) => sum + day.avgQuality, 0);
    return Math.round(total / this.sleepMetricsData.length);
  }

  // 🚀 BUSINESS INTELLIGENCE METHODS
  calculateUserAcquisitionCost(): number {
    const newUsers = this.userGrowthData.reduce((sum, day) => sum + day.newUsers, 0);
    const marketingSpend = 2500; // Mock marketing budget
    return marketingSpend / newUsers;
  }

  calculateLifetimeValue(): number {
    const avgRevenuePerUser = this.getTotalRevenue() / this.getTotalUsers();
    const avgRetentionMonths = 8.5; // Mock data
    return avgRevenuePerUser * avgRetentionMonths;
  }

  getROI(): number {
    const ltv = this.calculateLifetimeValue();
    const cac = this.calculateUserAcquisitionCost();
    return ((ltv - cac) / cac) * 100;
  }

  // 📈 REAL-TIME UPDATES
  startRealTimeUpdates(): void {
    setInterval(() => {
      this.updateRealTimeStats();
    }, 5000); // Update every 5 seconds
  }

  updateRealTimeStats(): void {
    // Simulate real-time data changes
    this.realTimeStats = {
      activeUsers: Math.floor(Math.random() * 50) + 200,
      currentSessions: Math.floor(Math.random() * 30) + 70,
      revenueToday: this.realTimeStats.revenueToday + (Math.random() * 10),
      appDownloads: this.realTimeStats.appDownloads + Math.floor(Math.random() * 3)
    };
  }

  // 🎯 FORMATTING METHODS
  formatValue(metric: AnalyticsMetric): string {
    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(metric.value as number);
      case 'percentage':
        return `${metric.value}%`;
      case 'duration':
        return `${metric.value}h`;
      default:
        return metric.value.toLocaleString();
    }
  }

  getTrendIcon(trend: 'up' | 'down'): string {
    return trend === 'up' ? '📈' : '📉';
  }

  getTrendColor(trend: 'up' | 'down'): string {
    return trend === 'up' ? '#10b981' : '#ef4444';
  }

  getRandomHeight(index: number): number {
    return Math.random() * 60 + 40;
  }

  // 🎪 MALIK'S SPECIAL FEATURES
  exportAnalyticsReport(): void {
    console.log('📊 Exporting analytics report');
    alert(`📊 ANALYTICS REPORT EXPORTED\n\n✅ PDF Report Generated\n✅ Excel Data Exported\n✅ Charts Included\n✅ Executive Summary\n\nReady for investor meetings!`);
  }

  showInvestorDeck(): void {
    console.log('🎯 Showing investor deck');
    alert(`🎯 INVESTOR DECK READY\n\n📈 Monthly Growth: 28.3%\n💰 MRR: $${this.getTotalRevenue().toLocaleString()}\n👥 Users: ${this.getTotalUsers().toLocaleString()}\n📊 Retention: 78%\n🎯 ROI: ${Math.round(this.getROI())}%\n\n🚀 Ready to raise millions!`);
  }

  simulateDataGrowth(): void {
    console.log('📈 Simulating data growth');
    // Add growth to all metrics
    this.metrics = this.metrics.map(metric => {
      if (metric.trend === 'up') {
        const growth = Math.random() * 0.05 + 0.01; // 1-6% growth
        return {
          ...metric,
          value: typeof metric.value === 'number' ? 
            Math.round(metric.value * (1 + growth) * 100) / 100 : metric.value,
          change: `+${(growth * 100).toFixed(1)}%`
        };
      }
      return metric;
    });
    alert('📈 DATA GROWTH SIMULATED\n\nAll metrics updated with realistic growth patterns!');
  }

  showCompetitiveAnalysis(): void {
    console.log('💀 Showing competitive analysis');
    alert(`💀 COMPETITIVE ANALYSIS\n\n🎯 YOUR APP VS INDUSTRY AVERAGE:\n\n📈 User Growth: +12.5% (Industry: +5.2%)\n💰 Revenue Growth: +28.3% (Industry: +12.1%)\n⭐ Sleep Quality: 86% (Industry: 72%)\n📊 Retention: 78% (Industry: 62%)\n\n🚀 Conclusion: Dominating the market!`);
  }

  // 🕒 TIME RANGE HANDLING
  changeTimeRange(range: string): void {
    this.timeRange = range;
    this.isLoading = true;
    console.log(`🕒 Changing time range to: ${range}`);
    // Simulate loading new data
    setTimeout(() => {
      this.generateMockData();
      this.isLoading = false;
    }, 1000);
  }

  getTimeRangeDisplay(): string {
    const ranges: { [key: string]: string } = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days',
      '1y': 'Last Year',
      'all': 'All Time'
    };
    return ranges[this.timeRange] || 'Last 30 Days';
  }
}