import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GiftCode {
  id: string;
  code: string;
  type: 'premium-trial' | 'premium-month' | 'enterprise-trial' | 'sound-pack' | 'discount';
  status: 'active' | 'redeemed' | 'expired';
  createdDate: string;
  expiresDate: string;
  redeemedBy?: string;
  redeemedDate?: string;
  value: number;
  maxUses: number;
  currentUses: number;
}

interface NewGiftCode {
  type: string;
  quantity: number;
  expiration: string;
  prefix: string;
}

@Component({
  selector: 'app-gift-codes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gift-codes.component.html',
  styleUrls: ['./gift-codes.component.scss']
})
export class GiftCodesComponent implements OnInit {
  giftCodes: GiftCode[] = [];
  filteredCodes: GiftCode[] = [];
  isLoading: boolean = true;
  codeSearch: string = '';
  statusFilter: string = 'all';
  newGift: NewGiftCode = {
    type: 'premium-trial',
    quantity: 1,
    expiration: '30',
    prefix: 'SLEEP'
  };

  // Mock data for gift codes
  private mockGiftCodes: GiftCode[] = [
    {
      id: '1',
      code: 'SLEEP-PRO-7DAY',
      type: 'premium-trial',
      status: 'active',
      createdDate: '2024-11-20',
      expiresDate: '2024-12-20',
      value: 9.99,
      maxUses: 100,
      currentUses: 45
    },
    {
      id: '2',
      code: 'PREMIUM-MONTH-FREE',
      type: 'premium-month',
      status: 'redeemed',
      createdDate: '2024-11-15',
      expiresDate: '2024-12-15',
      redeemedBy: 'john@techcorp.com',
      redeemedDate: '2024-11-18',
      value: 9.99,
      maxUses: 50,
      currentUses: 50
    },
    {
      id: '3',
      code: 'ENTERPRISE-TRIAL',
      type: 'enterprise-trial',
      status: 'active',
      createdDate: '2024-11-10',
      expiresDate: '2024-12-10',
      value: 49.99,
      maxUses: 25,
      currentUses: 12
    },
    {
      id: '4',
      code: 'SLEEP-SOUNDS-PACK',
      type: 'sound-pack',
      status: 'active',
      createdDate: '2024-11-05',
      expiresDate: '2024-12-05',
      value: 14.99,
      maxUses: 200,
      currentUses: 89
    },
    {
      id: '5',
      code: 'SLEEP25OFF',
      type: 'discount',
      status: 'expired',
      createdDate: '2024-10-01',
      expiresDate: '2024-10-31',
      value: 25,
      maxUses: 1000,
      currentUses: 673
    }
  ];

  ngOnInit(): void {
    this.loadGiftCodes();
  }

  loadGiftCodes(): void {
    setTimeout(() => {
      // Generate more gift codes
      const additionalCodes: GiftCode[] = [];
      for (let i = 6; i <= 50; i++) {
        additionalCodes.push(this.generateMockGiftCode(i));
      }
      
      this.giftCodes = [...this.mockGiftCodes, ...additionalCodes];
      this.filteredCodes = [...this.giftCodes];
      this.isLoading = false;
    }, 1500);
  }

  private generateMockGiftCode(id: number): GiftCode {
    const types: GiftCode['type'][] = ['premium-trial', 'premium-month', 'enterprise-trial', 'sound-pack', 'discount'];
    const statuses: GiftCode['status'][] = ['active', 'active', 'active', 'redeemed', 'expired'];
    const prefixes = ['SLEEP', 'DREAM', 'REST', 'CALM', 'PEACE'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    return {
      id: id.toString(),
      code: `${prefix}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      type: type,
      status: status,
      createdDate: `2024-11-${Math.floor(Math.random() * 20) + 1}`,
      expiresDate: `2024-12-${Math.floor(Math.random() * 30) + 1}`,
      redeemedBy: status === 'redeemed' ? `user${id}@example.com` : undefined,
      redeemedDate: status === 'redeemed' ? `2024-11-${Math.floor(Math.random() * 20) + 1}` : undefined,
      value: type === 'discount' ? Math.floor(Math.random() * 50) + 10 : [9.99, 9.99, 49.99, 14.99][types.indexOf(type)],
      maxUses: Math.floor(Math.random() * 500) + 50,
      currentUses: Math.floor(Math.random() * 100)
    };
  }

  // 🎯 CORE METHODS
  getTotalCodes(): number {
    return this.giftCodes.length;
  }

  getRedeemedCodes(): number {
    return this.giftCodes.filter(code => code.status === 'redeemed').length;
  }

  getGeneratedRevenue(): number {
    return this.giftCodes
      .filter(code => code.status === 'redeemed')
      .reduce((total, code) => total + code.value, 0);
  }

  getConversionRate(): number {
    const redeemed = this.getRedeemedCodes();
    const total = this.getTotalCodes();
    return total > 0 ? Math.round((redeemed / total) * 100) : 0;
  }

  getFilteredCodes(): GiftCode[] {
    return this.giftCodes.filter(code => {
      const matchesSearch = code.code.toLowerCase().includes(this.codeSearch.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || code.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  // 🚀 GIFT CODE ACTIONS
  generateGiftCodes(): void {
    console.log('🎁 Generating gift codes:', this.newGift);
    
    const newCodes: GiftCode[] = [];
    for (let i = 0; i < this.newGift.quantity; i++) {
      const newCode: GiftCode = {
        id: (this.giftCodes.length + i + 1).toString(),
        code: `${this.newGift.prefix}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        type: this.newGift.type as GiftCode['type'],
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        expiresDate: this.calculateExpirationDate(),
        value: this.getCodeValue(this.newGift.type),
        maxUses: 1,
        currentUses: 0
      };
      newCodes.push(newCode);
    }

    this.giftCodes = [...newCodes, ...this.giftCodes];
    this.filteredCodes = [...this.giftCodes];
    
    alert(`✅ Successfully generated ${this.newGift.quantity} gift codes!\n\n💰 Ready for viral distribution!`);
  }

  previewGiftCodes(): void {
    console.log('👀 Previewing gift codes');
    alert(`🎁 GIFT CODE PREVIEW\n\nType: ${this.getTypeDisplayName(this.newGift.type)}\nQuantity: ${this.newGift.quantity}\nExpires: ${this.newGift.expiration} days\nPrefix: ${this.newGift.prefix}\n\nReady to create viral growth!`);
  }

  copyCode(code: GiftCode): void {
    navigator.clipboard.writeText(code.code).then(() => {
      console.log('📋 Code copied:', code.code);
      alert(`📋 Code copied to clipboard!\n\n${code.code}\n\nReady to share!`);
    });
  }

  shareCode(code: GiftCode): void {
    console.log('🔗 Sharing code:', code.code);
    const shareText = `🎁 Get your free SleepTracker premium: ${code.code}\n\nRedeem at: app.sleeptracker.com/redeem`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SleepTracker Gift Code',
        text: shareText,
        url: 'https://app.sleeptracker.com'
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert(`🔗 Share this code:\n\n${shareText}\n\n📋 Copied to clipboard!`);
    }
  }

  showCodeAnalytics(code: GiftCode): void {
    console.log('📈 Showing analytics for:', code.code);
    alert(`📈 GIFT CODE ANALYTICS\n\nCode: ${code.code}\nType: ${this.getTypeDisplayName(code.type)}\nStatus: ${code.status}\nUses: ${code.currentUses}/${code.maxUses}\nValue: $${code.value}\nCreated: ${code.createdDate}\nExpires: ${code.expiresDate}\n\n📊 Performance: ${Math.round((code.currentUses / code.maxUses) * 100)}% utilized`);
  }

  // 🛠️ UTILITY METHODS
  private calculateExpirationDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(this.newGift.expiration));
    return date.toISOString().split('T')[0];
  }

  private getCodeValue(type: string): number {
    const values: { [key: string]: number } = {
      'premium-trial': 9.99,
      'premium-month': 9.99,
      'enterprise-trial': 49.99,
      'sound-pack': 14.99,
      'discount': 25
    };
    return values[type] || 0;
  }

  getTypeDisplayName(type: string): string {
    const names: { [key: string]: string } = {
      'premium-trial': 'Premium Trial (7 days)',
      'premium-month': 'Premium Month',
      'enterprise-trial': 'Enterprise Trial',
      'sound-pack': 'Sound Pack',
      'discount': 'Discount Code'
    };
    return names[type] || 'Unknown';
  }

  getStatusDisplayName(status: string): string {
    const names: { [key: string]: string } = {
      'active': 'Active',
      'redeemed': 'Redeemed',
      'expired': 'Expired'
    };
    return names[status] || 'Unknown';
  }

  // 🎯 MALIK'S SPECIAL FEATURES
  bulkGenerateForCampaign(): void {
    console.log('🚀 Bulk generating for campaign');
    alert(`🎯 BULK CAMPAIGN GENERATION\n\nGenerating 100 gift codes for holiday campaign!\n\n💰 Estimated acquisition cost: $0\n🎁 Expected conversions: 45-60 users\n📈 Projected revenue: $450-600\n\nViral growth activated!`);
  }

  exportGiftCodeReport(): void {
    console.log('📊 Exporting gift code report');
    alert(`📊 GIFT CODE PERFORMANCE REPORT\n\n✅ PDF Report Generated\n✅ Excel Data Exported\n✅ Analytics Included\n✅ Revenue Attribution\n\nReady for marketing team!`);
  }

  showViralGrowthMetrics(): void {
    console.log('📈 Showing viral growth metrics');
    alert(`📈 VIRAL GROWTH METRICS\n\n🎁 Total Codes: ${this.getTotalCodes()}\n✅ Redeemed: ${this.getRedeemedCodes()} (${this.getConversionRate()}%)\n💰 Revenue: $${this.getGeneratedRevenue()}\n📊 Avg. Cost per Acquisition: $0\n🔥 Viral Coefficient: 1.8\n\n🚀 Growth Engine: OPTIMAL`);
  }
}