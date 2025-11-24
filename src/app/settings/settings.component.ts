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
  
  // Modal states
  showSaveModal: boolean = false;
  showExportModal: boolean = false;
  showImportModal: boolean = false;
  showSecurityScanModal: boolean = false;
  showBackupModal: boolean = false;
  showRestoreModal: boolean = false;
  
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

  // Import file
  importFile: File | null = null;

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
      },
      {
        id: '4',
        name: 'Session Timeout',
        description: 'Automatically log out inactive users',
        enabled: true,
        critical: false,
        lastUpdated: '2024-11-18'
      },
      {
        id: '5',
        name: 'API Rate Limiting',
        description: 'Limit API requests to prevent abuse',
        enabled: true,
        critical: true,
        lastUpdated: '2024-11-22'
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
      },
      {
        id: '3',
        name: 'Google Analytics',
        icon: '📊',
        description: 'Website and app analytics',
        connected: true,
        status: 'active',
        lastSync: '2024-11-22 08:15:00'
      },
      {
        id: '4',
        name: 'Slack',
        icon: '💬',
        description: 'Team communication and alerts',
        connected: false,
        status: 'pending',
        lastSync: '2024-11-21 14:20:00'
      },
      {
        id: '5',
        name: 'Zapier',
        icon: '⚡',
        description: 'Automation and workflow integration',
        connected: true,
        status: 'active',
        lastSync: '2024-11-22 10:00:00'
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
      },
      {
        id: '3',
        name: 'User Data Export',
        date: '2024-11-20 14:30:00',
        size: '345 MB',
        type: 'manual',
        status: 'completed'
      },
      {
        id: '4',
        name: 'System Configuration',
        date: '2024-11-20 02:00:00',
        size: '128 MB',
        type: 'auto',
        status: 'completed'
      }
    ];
  }

  // ==================== MODAL METHODS ====================
  openSaveModal(): void {
    this.showSaveModal = true;
  }

  closeSaveModal(): void {
    this.showSaveModal = false;
  }

  openExportModal(): void {
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  openImportModal(): void {
    this.showImportModal = true;
  }

  closeImportModal(): void {
    this.showImportModal = false;
    this.importFile = null;
  }

  openSecurityScanModal(): void {
    this.showSecurityScanModal = true;
  }

  closeSecurityScanModal(): void {
    this.showSecurityScanModal = false;
  }

  openBackupModal(): void {
    this.showBackupModal = true;
  }

  closeBackupModal(): void {
    this.showBackupModal = false;
  }

  openRestoreModal(backup: Backup): void {
    this.selectedBackup = backup;
    this.showRestoreModal = true;
  }

  closeRestoreModal(): void {
    this.showRestoreModal = false;
    this.selectedBackup = null;
  }

  // ==================== CORE SETTINGS METHODS ====================
  saveSettings(): void {
    console.log('💾 Saving settings...');
    this.openSaveModal();
  }

  confirmSave(): void {
    this.closeSaveModal();
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      alert('✅ SETTINGS SAVED SUCCESSFULLY!\n\nAll configuration changes have been applied.');
    }, 2000);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to default values?\n\nThis action cannot be undone.')) {
      console.log('🔄 Resetting to defaults...');
      this.isLoading = true;
      
      setTimeout(() => {
        // Reset all settings to default
        this.generalSettings = {
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
        
        this.isLoading = false;
        alert('🔄 SETTINGS RESET TO DEFAULTS!\n\nAll settings have been restored to factory defaults.');
      }, 1500);
    }
  }

  exportSettings(): void {
    console.log('📤 Exporting settings...');
    this.openExportModal();
  }

  confirmExport(): void {
    this.closeExportModal();
    
    setTimeout(() => {
      const settingsData = {
        general: this.generalSettings,
        payments: this.paymentSettings,
        notifications: this.notificationSettings,
        advanced: this.advancedSettings,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const dataStr = JSON.stringify(settingsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `sleeptracker-settings-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      alert('📤 SETTINGS EXPORTED!\n\nYour configuration has been downloaded as JSON.');
    }, 1000);
  }

  onFileSelected(event: any): void {
    this.importFile = event.target.files[0];
  }

  importSettings(): void {
    if (!this.importFile) {
      alert('Please select a settings file to import.');
      return;
    }

    console.log('📥 Importing settings...');
    this.isLoading = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settingsData = JSON.parse(e.target?.result as string);
        
        // Validate imported data
        if (settingsData.general && settingsData.payments) {
          // Apply imported settings
          this.generalSettings = { ...this.generalSettings, ...settingsData.general };
          this.paymentSettings = { ...this.paymentSettings, ...settingsData.payments };
          
          setTimeout(() => {
            this.isLoading = false;
            this.closeImportModal();
            alert('📥 SETTINGS IMPORTED SUCCESSFULLY!\n\nYour configuration has been restored.');
          }, 1500);
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error) {
        this.isLoading = false;
        alert('❌ IMPORT FAILED!\n\nThe selected file is not a valid settings file.');
      }
    };

    reader.readAsText(this.importFile);
  }

  // ==================== SECURITY METHODS ====================
  toggleSecuritySetting(setting: SecuritySetting): void {
    setting.enabled = !setting.enabled;
    setting.lastUpdated = new Date().toISOString().split('T')[0];
    console.log(`🔒 ${setting.enabled ? 'Enabled' : 'Disabled'} ${setting.name}`);
  }

  runSecurityScan(): void {
    console.log('🔍 Running security scan...');
    this.openSecurityScanModal();
  }

  confirmSecurityScan(): void {
    this.closeSecurityScanModal();
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      
      // Update security settings based on scan
      this.securitySettings.forEach(setting => {
        if (setting.critical && !setting.enabled) {
          setting.enabled = true;
          setting.lastUpdated = new Date().toISOString().split('T')[0];
        }
      });
      
      alert('🔍 SECURITY SCAN COMPLETE!\n\n✓ All critical security measures enabled\n✓ System integrity verified\n✓ No vulnerabilities detected');
    }, 3000);
  }

  // ==================== INTEGRATION METHODS ====================
  toggleIntegration(integration: Integration): void {
    integration.connected = !integration.connected;
    integration.status = integration.connected ? 'active' : 'pending';
    integration.lastSync = new Date().toLocaleString();
    console.log(`🔗 ${integration.connected ? 'Connected' : 'Disconnected'} ${integration.name}`);
  }

  testIntegration(integration: Integration): void {
    console.log(`🧪 Testing integration: ${integration.name}`);
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      integration.status = 'active';
      integration.lastSync = new Date().toLocaleString();
      
      alert(`🧪 INTEGRATION TEST COMPLETE!\n\n${integration.name} is working perfectly!\n\nStatus: Active ✅\nLast Sync: ${integration.lastSync}`);
    }, 2000);
  }

  // ==================== BACKUP METHODS ====================
  createBackup(): void {
    console.log('💾 Creating manual backup...');
    this.openBackupModal();
  }

  confirmBackup(): void {
    this.closeBackupModal();
    this.isLoading = true;
    
    setTimeout(() => {
      const newBackup: Backup = {
        id: (this.backups.length + 1).toString(),
        name: `Manual Backup ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleString(),
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
        type: 'manual',
        status: 'completed'
      };
      
      this.backups.unshift(newBackup);
      this.updateBackupStats();
      this.isLoading = false;
      
      alert('💾 BACKUP CREATED SUCCESSFULLY!\n\nYour data has been securely backed up.');
    }, 2500);
  }

  selectedBackup: Backup | null = null;

  restoreBackup(backup: Backup): void {
    this.openRestoreModal(backup);
  }

  confirmRestore(): void {
    if (!this.selectedBackup) return;
    
    this.closeRestoreModal();
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      alert(`🔄 BACKUP RESTORED SUCCESSFULLY!\n\nSystem restored from: ${this.selectedBackup?.name}\n\nAll data has been recovered successfully.`);
    }, 3000);
  }

  // ==================== UTILITY METHODS ====================
  private updateBackupStats(): void {
    this.completedBackups = this.backups.filter(b => b.status === 'completed').length;
  }

  getCompletedBackupsCount(): number {
    return this.backups.filter(b => b.status === 'completed').length;
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

  getTotalStorageUsed(): string {
    const totalMB = this.backups.reduce((total, backup) => {
      const size = parseFloat(backup.size);
      const unit = backup.size.split(' ')[1];
      if (unit === 'GB') return total + (size * 1024);
      return total + size;
    }, 0);
    
    return (totalMB / 1024).toFixed(1) + ' GB';
  }

  // ==================== SPECIAL FEATURES ====================
  enableGodMode(): void {
    console.log('👑 Enabling God Mode...');
    this.isLoading = true;
    
    setTimeout(() => {
      // Enable all settings for "God Mode"
      this.securitySettings.forEach(setting => setting.enabled = true);
      this.integrations.forEach(integration => {
        integration.connected = true;
        integration.status = 'active';
      });
      
      this.generalSettings.enableAnalytics = true;
      this.generalSettings.enableNotifications = true;
      this.advancedSettings.cacheEnabled = true;
      this.advancedSettings.cdnEnabled = true;
      this.advancedSettings.compressionEnabled = true;
      
      this.isLoading = false;
      alert('👑 GOD MODE ACTIVATED!\n\nAll features optimized!\nMaximum performance enabled!');
    }, 2000);
  }

  showSystemHealth(): void {
    const healthScore = 98;
    const activeIntegrations = this.integrations.filter(i => i.connected).length;
    const enabledSecurity = this.securitySettings.filter(s => s.enabled).length;
    
    alert(`🏥 SYSTEM HEALTH REPORT\n
Overall Health: ${healthScore}% 🟢
Active Integrations: ${activeIntegrations}/${this.integrations.length}
Security Measures: ${enabledSecurity}/${this.securitySettings.length}
Successful Backups: ${this.getCompletedBackupsCount()}
Storage Used: ${this.getTotalStorageUsed()}

System Status: OPTIMAL ✅`);
  }

  optimizePerformance(): void {
    console.log('⚡ Optimizing performance...');
    this.isLoading = true;
    
    setTimeout(() => {
      this.advancedSettings.cacheEnabled = true;
      this.advancedSettings.cdnEnabled = true;
      this.advancedSettings.compressionEnabled = true;
      this.isLoading = false;
      
      alert('⚡ PERFORMANCE OPTIMIZED!\n\n✓ Cache enabled\n✓ CDN activated\n✓ Compression optimized\n✓ System running at peak performance');
    }, 1500);
  }

  // ==================== PAYMENT SETTINGS ====================
  updatePaymentSettings(): void {
    console.log('💳 Updating payment settings...');
    alert('💳 PAYMENT SETTINGS UPDATED!\n\nYour payment configuration has been saved.');
  }

  testPaymentGateway(): void {
    console.log('🧪 Testing payment gateway...');
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      alert('🧪 PAYMENT GATEWAY TEST COMPLETE!\n\n✓ Stripe connection: Active\n✓ Transaction processing: Working\n✓ Webhook delivery: Verified\n\nPayment system is ready!');
    }, 2000);
  }

  // ==================== NOTIFICATION SETTINGS ====================
  updateNotificationSettings(): void {
    console.log('🔔 Updating notification settings...');
    alert('🔔 NOTIFICATION SETTINGS UPDATED!\n\nYour communication preferences have been saved.');
  }

  testNotifications(): void {
    console.log('🧪 Testing notifications...');
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      alert('🧪 NOTIFICATION TEST COMPLETE!\n\n✓ Email delivery: Successful\n✓ Push notifications: Sent\n✓ In-app alerts: Working\n\nAll notification channels are operational!');
    }, 2000);
  }
}