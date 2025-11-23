import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  enabled: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
  lastUpdated: string;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  status: 'active' | 'pending' | 'error';
  lastSync: string;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed' | 'in-progress';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Main Settings State
  isLoading: boolean = true;
  activeSection: string = 'general';
  
  // Settings Data
  settingSections: SettingSection[] = [];
  securitySettings: SecuritySetting[] = [];
  integrations: Integration[] = [];
  backups: Backup[] = [];
  
  // Backup Stats
  completedBackups: number = 0;
  
  // Form Models
  generalSettings = {
    appName: 'SleepTracker Pro',
    companyName: 'Malik Tech Solutions',
    supportEmail: 'support@sleeptracker.com',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
    maintenanceMode: false,
    enableAnalytics: true,
    enableNotifications: true
  };

  paymentSettings = {
    stripeEnabled: true,
    paypalEnabled: false,
    currency: 'USD',
    taxRate: 0.08,
    invoicePrefix: 'SLEEP',
    lateFeeEnabled: true,
    lateFeeAmount: 15,
    gracePeriod: 3
  };

  notificationSettings = {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    marketingEmails: true,
    securityAlerts: true,
    billingReminders: true,
    sleepReports: true,
    weeklyDigest: true
  };

  advancedSettings = {
    cacheEnabled: true,
    cdnEnabled: true,
    compressionEnabled: true,
    loggingLevel: 'info',
    apiRateLimit: 1000,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    dataRetention: 365
  };

  ngOnInit(): void {
    this.loadSettingsData();
  }

  loadSettingsData(): void {
    setTimeout(() => {
      this.generateMockData();
      this.updateBackupStats();
      this.isLoading = false;
    }, 1500);
  }

  generateMockData(): void {
    // Setting Sections
    this.settingSections = [
      {
        id: 'general',
        title: 'General Settings',
        icon: '⚙️',
        description: 'Basic application configuration and preferences',
        enabled: true
      },
      {
        id: 'security',
        title: 'Security & Privacy',
        icon: '🔒',
        description: 'Security protocols and privacy controls',
        enabled: true
      },
      {
        id: 'payments',
        title: 'Payment Processing',
        icon: '💳',
        description: 'Payment gateway and billing configuration',
        enabled: true
      },
      {
        id: 'notifications',
        title: 'Notifications',
        icon: '🔔',
        description: 'Communication and alert preferences',
        enabled: true
      },
      {
        id: 'integrations',
        title: 'Integrations',
        icon: '🔗',
        description: 'Third-party services and API connections',
        enabled: true
      },
      {
        id: 'backup',
        title: 'Backup & Recovery',
        icon: '💾',
        description: 'Data backup and disaster recovery',
        enabled: true
      },
      {
        id: 'advanced',
        title: 'Advanced',
        icon: '🎛️',
        description: 'Advanced system configuration',
        enabled: true
      }
    ];

    // Security Settings
    this.securitySettings = [
      {
        id: '1',
        name: 'Two-Factor Authentication',
        description: 'Require 2FA for all admin accounts',
        enabled: true,
        critical: true,
        lastUpdated: '2024-11-20'
      },
      {
        id: '2',
        name: 'Password Policy',
        description: 'Enforce strong password requirements',
        enabled: true,
        critical: true,
        lastUpdated: '2024-11-15'
      },
      {
        id: '3',
        name: 'IP Whitelisting',
        description: 'Restrict access to specific IP addresses',
        enabled: false,
        critical: false,
        lastUpdated: '2024-11-10'
      }
    ];

    // Integrations
    this.integrations = [
      {
        id: '1',
        name: 'Stripe Payments',
        icon: '💳',
        description: 'Process payments and subscriptions',
        connected: true,
        status: 'active',
        lastSync: '2024-11-22 09:45:00'
      },
      {
        id: '2',
        name: 'SendGrid',
        icon: '📧',
        description: 'Transactional email delivery',
        connected: true,
        status: 'active',
        lastSync: '2024-11-22 09:30:00'
      }
    ];

    // Backups
    this.backups = [
      {
        id: '1',
        name: 'Full System Backup',
        date: '2024-11-22 02:00:00',
        size: '2.4 GB',
        type: 'auto',
        status: 'completed'
      },
      {
        id: '2',
        name: 'Database Only',
        date: '2024-11-21 02:00:00',
        size: '856 MB',
        type: 'auto',
        status: 'completed'
      }
    ];
  }

  // Backup Utility Methods
  getCompletedBackupsCount(): number {
    return this.backups.filter(b => b.status === 'completed').length;
  }

  private updateBackupStats(): void {
    this.completedBackups = this.getCompletedBackupsCount();
  }

  getBackupStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'in-progress': return '#f59e0b';
      default: return '#94a3b8';
    }
  }

  getIntegrationStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  // Core Settings Methods
  saveSettings(): void {
    console.log('💾 Saving settings...');
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('✅ SETTINGS SAVED SUCCESSFULLY!');
    }, 1000);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      console.log('🔄 Resetting to defaults...');
      alert('🔄 SETTINGS RESET TO DEFAULTS!');
    }
  }

  exportSettings(): void {
    console.log('📤 Exporting settings...');
    alert('📤 SETTINGS EXPORTED!');
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (file) {
      alert('📥 SETTINGS IMPORTED SUCCESSFULLY!');
    }
  }

  // Security Methods
  toggleSecuritySetting(setting: SecuritySetting): void {
    setting.enabled = !setting.enabled;
    setting.lastUpdated = new Date().toISOString().split('T')[0];
    console.log(`🔒 ${setting.enabled ? 'Enabled' : 'Disabled'} ${setting.name}`);
  }

  runSecurityScan(): void {
    console.log('🔍 Running security scan...');
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('🔍 SECURITY SCAN COMPLETE!');
    }, 2000);
  }

  // Integration Methods
  toggleIntegration(integration: Integration): void {
    integration.connected = !integration.connected;
    integration.status = integration.connected ? 'active' : 'pending';
    console.log(`🔗 ${integration.connected ? 'Connected' : 'Disconnected'} ${integration.name}`);
  }

  testIntegration(integration: Integration): void {
    console.log(`🧪 Testing integration: ${integration.name}`);
    setTimeout(() => {
      alert(`🧪 INTEGRATION TEST COMPLETE!\n\n${integration.name} is working perfectly!`);
    }, 1000);
  }

  // Backup Methods
  createBackup(): void {
    console.log('💾 Creating manual backup...');
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('💾 BACKUP CREATED SUCCESSFULLY!');
    }, 3000);
  }

  restoreBackup(backup: Backup): void {
    if (confirm(`Are you sure you want to restore from "${backup.name}"?`)) {
      console.log('🔄 Restoring from backup:', backup);
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        alert('🔄 BACKUP RESTORED SUCCESSFULLY!');
      }, 2500);
    }
  }

  // Special Features
  enableGodMode(): void {
    console.log('👑 Enabling God Mode...');
    alert('👑 GOD MODE ACTIVATED!\n\nAll features optimized!');
  }

  showSystemHealth(): void {
    alert('🏥 SYSTEM HEALTH REPORT\n\nOverall Health: 98% 🟢');
  }

  optimizePerformance(): void {
    console.log('⚡ Optimizing performance...');
    alert('⚡ PERFORMANCE OPTIMIZED!');
  }
}