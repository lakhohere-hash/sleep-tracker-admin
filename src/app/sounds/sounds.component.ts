import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Sound {
  id: string;
  name: string;
  description?: string;
  category: 'nature' | 'ambient' | 'white-noise' | 'meditation' | 'urban' | 'binaural' | 'asmr';
  duration: string;
  fileSize: string;
  bitrate: string;
  premium: boolean;
  featured: boolean;
  plays: number;
  downloads: number;
  rating: number;
  quality: number;
  usage: number;
  uploadDate: string;
  uploader?: string;
  tags: string[];
}

@Component({
  selector: 'app-sounds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss']
})
export class SoundsComponent implements OnInit {
  sounds: Sound[] = [];
  filteredSounds: Sound[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedPremium: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  showMastering: boolean = false;
  playingSound: string | null = null;

  // Mock data for 260+ premium sounds
  private mockSounds: Sound[] = [
    {
      id: '1',
      name: 'Ocean Waves Premium',
      description: 'Crystal clear ocean waves recorded in Hawaii',
      category: 'nature',
      duration: '8:24',
      fileSize: '15.2 MB',
      bitrate: '320kbps',
      premium: true,
      featured: true,
      plays: 15420,
      downloads: 8920,
      rating: 4.9,
      quality: 98,
      usage: 85,
      uploadDate: '2024-01-15',
      uploader: 'Audio Master Pro',
      tags: ['ocean', 'waves', 'sleep', 'calm']
    },
    {
      id: '2',
      name: 'Deep Space Meditation',
      description: 'Binaural beats for deep space meditation',
      category: 'meditation',
      duration: '12:15',
      fileSize: '22.8 MB',
      bitrate: '320kbps',
      premium: true,
      featured: false,
      plays: 8920,
      downloads: 4560,
      rating: 4.8,
      quality: 96,
      usage: 72,
      uploadDate: '2024-02-20',
      tags: ['space', 'meditation', 'binaural', 'deep']
    },
    {
      id: '3',
      name: 'City Rain Ambience',
      description: 'Gentle rain in a peaceful city environment',
      category: 'urban',
      duration: '6:45',
      fileSize: '12.1 MB',
      bitrate: '256kbps',
      premium: false,
      featured: false,
      plays: 12350,
      downloads: 7890,
      rating: 4.7,
      quality: 92,
      usage: 68,
      uploadDate: '2024-01-22',
      tags: ['rain', 'city', 'urban', 'ambient']
    },
    {
      id: '4',
      name: 'Forest Birds Morning',
      description: 'Morning birds in a dense forest',
      category: 'nature',
      duration: '10:30',
      fileSize: '18.9 MB',
      bitrate: '320kbps',
      premium: false,
      featured: true,
      plays: 18760,
      downloads: 9230,
      rating: 4.9,
      quality: 95,
      usage: 79,
      uploadDate: '2024-03-05',
      tags: ['forest', 'birds', 'morning', 'nature']
    },
    {
      id: '5',
      name: 'Brown Noise Generator',
      description: 'Smooth brown noise for deep focus',
      category: 'white-noise',
      duration: '∞',
      fileSize: '3.2 MB',
      bitrate: '192kbps',
      premium: true,
      featured: false,
      plays: 25680,
      downloads: 13450,
      rating: 4.6,
      quality: 88,
      usage: 91,
      uploadDate: '2024-02-14',
      tags: ['brown-noise', 'focus', 'study', 'white-noise']
    },
    {
      id: '6',
      name: 'ASMR Tibetan Bowls',
      description: 'Healing Tibetan singing bowls ASMR',
      category: 'asmr',
      duration: '15:20',
      fileSize: '25.6 MB',
      bitrate: '320kbps',
      premium: true,
      featured: true,
      plays: 18900,
      downloads: 10200,
      rating: 4.9,
      quality: 97,
      usage: 83,
      uploadDate: '2024-04-10',
      tags: ['asmr', 'tibetan', 'bowls', 'healing']
    }
  ];

  ngOnInit(): void {
    this.loadSounds();
  }

  loadSounds(): void {
    setTimeout(() => {
      // Generate more sounds to reach 260+
      const additionalSounds: Sound[] = [];
      for (let i = 7; i <= 260; i++) {
        additionalSounds.push(this.generateMockSound(i));
      }
      
      this.sounds = [...this.mockSounds, ...additionalSounds];
      this.filteredSounds = [...this.sounds];
      this.isLoading = false;
    }, 2500);
  }

  private generateMockSound(id: number): Sound {
    const categories: Sound['category'][] = ['nature', 'ambient', 'white-noise', 'meditation', 'urban', 'binaural', 'asmr'];
    const names = [
      'Mountain Stream', 'Thunderstorm', 'Zen Garden', 'Coffee Shop', 'Airplane Cabin',
      'Fireplace', 'Wind Chimes', 'Underwater', 'Desert Wind', 'Winter Storm',
      'Jungle Night', 'Rainforest', 'Clock Ticking', 'Fan Noise', 'Pink Noise',
      'Gamma Waves', 'Theta Meditation', 'Alpha Focus', 'Delta Sleep', 'Ocean Deep'
    ];
    const adjectives = ['Premium', 'Pro', 'Enhanced', 'Ultra', 'Master', 'HD', '3D', 'Binaural', 'ASMR'];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = `${names[Math.floor(Math.random() * names.length)]} ${adjectives[Math.floor(Math.random() * adjectives.length)]}`;
    const premium = Math.random() > 0.6;
    const featured = Math.random() > 0.8;
    
    return {
      id: id.toString(),
      name: name,
      category: category,
      duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      fileSize: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
      bitrate: `${premium ? '320' : '256'}kbps`,
      premium: premium,
      featured: featured,
      plays: Math.floor(Math.random() * 20000) + 1000,
      downloads: Math.floor(Math.random() * 10000) + 500,
      rating: 4 + Math.random(),
      quality: Math.floor(Math.random() * 15) + 85,
      usage: Math.floor(Math.random() * 40) + 60,
      uploadDate: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      uploader: Math.random() > 0.5 ? 'Audio Master Pro' : undefined,
      tags: this.generateRandomTags(category)
    };
  }

  private generateRandomTags(category: string): string[] {
    const tagPools: { [key: string]: string[] } = {
      'nature': ['forest', 'ocean', 'birds', 'water', 'wind', 'animals', 'peaceful'],
      'ambient': ['background', 'atmospheric', 'space', 'dreamy', 'ethereal', 'floating'],
      'white-noise': ['focus', 'study', 'sleep', 'masking', 'consistent', 'steady'],
      'meditation': ['zen', 'calm', 'mindfulness', 'breathing', 'spiritual', 'healing'],
      'urban': ['city', 'traffic', 'people', 'modern', 'metropolitan', 'night'],
      'binaural': ['brainwaves', 'focus', 'meditation', 'frequencies', 'hemisphere'],
      'asmr': ['tingles', 'whisper', 'personal', 'intimate', 'relaxing', 'sleep']
    };
    
    const tags = tagPools[category] || ['audio', 'sound', 'relaxation'];
    const count = Math.floor(Math.random() * 3) + 2;
    const selectedTags: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      if (!selectedTags.includes(randomTag)) {
        selectedTags.push(randomTag);
      }
    }
    
    return selectedTags;
  }

  // 🎯 CORE METHODS

  getTotalSoundsCount(): number {
    return this.sounds.length;
  }

  getPremiumSoundsCount(): number {
    return this.sounds.filter(s => s.premium).length;
  }

  getTotalPlays(): number {
    return this.sounds.reduce((total, sound) => total + sound.plays, 0);
  }

  applyFilters(): void {
    this.filteredSounds = this.sounds.filter(sound => {
      const matchesSearch = 
        sound.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sound.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sound.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesCategory = this.selectedCategory === 'all' || 
        sound.category === this.selectedCategory;

      const matchesPremium = this.selectedPremium === 'all' || 
        (this.selectedPremium === 'premium' && sound.premium) ||
        (this.selectedPremium === 'free' && !sound.premium);

      return matchesSearch && matchesCategory && matchesPremium;
    });

    this.currentPage = 1;
  }

  getPaginatedSounds(): Sound[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSounds.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredSounds.length / this.itemsPerPage);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedPremium = 'all';
    this.applyFilters();
  }

  // 🚀 LEGENDARY AUDIO METHODS

  getCategoryDisplayName(category: string): string {
    const names: { [key: string]: string } = {
      'nature': 'Nature',
      'ambient': 'Ambient',
      'white-noise': 'White Noise',
      'meditation': 'Meditation',
      'urban': 'Urban',
      'binaural': 'Binaural',
      'asmr': 'ASMR'
    };
    return names[category] || 'Unknown';
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'nature': 'badge-nature',
      'ambient': 'badge-ambient',
      'white-noise': 'badge-whitenoise',
      'meditation': 'badge-meditation',
      'urban': 'badge-urban',
      'binaural': 'badge-binaural',
      'asmr': 'badge-asmr'
    };
    return classes[category] || 'badge-default';
  }

  getPremiumBadgeClass(premium: boolean): string {
    return premium ? 'badge-premium' : 'badge-free';
  }

  calculateSoundRevenue(): number {
    const premiumPlays = this.sounds
      .filter(s => s.premium)
      .reduce((total, sound) => total + sound.plays, 0);
    
    // Assume $0.001 per premium play
    return Math.round(premiumPlays * 0.001);
  }

  getTotalDuration(): string {
    const totalMinutes = this.sounds.reduce((total, sound) => {
      const [minutes, seconds] = sound.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }

  getAverageQuality(): number {
    const totalQuality = this.sounds.reduce((total, sound) => total + sound.quality, 0);
    return Math.round(totalQuality / this.sounds.length);
  }

  generateWaveform(): number[] {
    return Array.from({ length: 50 }, () => Math.floor(Math.random() * 80) + 20);
  }

  isPlaying(sound: Sound): boolean {
    return this.playingSound === sound.id;
  }

  togglePlay(sound: Sound): void {
    if (this.isPlaying(sound)) {
      this.playingSound = null;
    } else {
      this.playingSound = sound.id;
      console.log('🎵 Playing sound:', sound.name);
    }
  }

  // 🎛️ PROFESSIONAL AUDIO TOOLS

  getMasteringPresets(): any[] {
    return [
      { name: '🎧 Studio Quality', type: 'studio' },
      { name: '💤 Sleep Enhanced', type: 'sleep' },
      { name: '🎵 Meditation Boost', type: 'meditation' },
      { name: '🔊 Volume Maximizer', type: 'maximize' },
      { name: '🌊 Dynamic Range', type: 'dynamic' }
    ];
  }

  applyMasteringPreset(preset: any): void {
    console.log('🎛️ Applying mastering preset:', preset.name);
    alert(`🎛️ Applied ${preset.name} mastering preset!\n\nYour audio now sounds professional AF!`);
  }

  showAIMastering(): void {
    this.showMastering = true;
    console.log('🎛️ Opening AI Mastering panel');
  }

  // 🚀 ENTERPRISE ACTIONS

  previewSound(sound: Sound): void {
    console.log('🔊 Previewing sound:', sound.name);
    alert(`🔊 Preview: ${sound.name}\n\n🎵 Category: ${this.getCategoryDisplayName(sound.category)}\n⏱️ Duration: ${sound.duration}\n💎 Tier: ${sound.premium ? 'Premium' : 'Free'}\n⭐ Rating: ${sound.rating}/5`);
  }

  editSound(sound: Sound): void {
    console.log('⚡ Editing sound:', sound.name);
    alert(`⚡ Editing: ${sound.name}\n\nReady to make this sound even more legendary!`);
  }

  uploadSound(): void {
    console.log('📤 Opening sound upload modal');
    alert('📤 Sound Upload\n\nReady to add another competitor-destroying audio file!');
  }

  upgradeToPremium(sound: Sound): void {
    console.log('💎 Upgrading sound to premium:', sound.name);
    alert(`💎 UPGRADE SUCCESS!\n\n${sound.name} is now PREMIUM!\n\n💰 This sound will now generate revenue!`);
  }

  toggleFeatured(sound: Sound): void {
    console.log('⭐ Toggling featured status for:', sound.name);
    alert(`⭐ ${sound.featured ? 'Removed from' : 'Added to'} featured sounds!\n\n${sound.name} ${sound.featured ? 'is no longer' : 'is now'} featured.`);
  }

  showSoundAnalytics(sound: Sound): void {
    console.log('📈 Showing analytics for:', sound.name);
    alert(`📈 Sound Analytics: ${sound.name}\n\n▶️ Plays: ${sound.plays.toLocaleString()}\n⭐ Rating: ${sound.rating}/5\n💾 Downloads: ${sound.downloads.toLocaleString()}\n📊 Usage: ${sound.usage}%`);
  }

  showMoreActions(sound: Sound): void {
    console.log('🔧 Showing more actions for:', sound.name);
    const actions = [
      '📊 Detailed Analytics',
      '🎛️ Advanced Mastering',
      '📈 Performance Report',
      '🔗 Share Sound',
      '📥 Export Data',
      '⚙️ Sound Settings',
      '🎨 Custom Presets',
      '🚀 AI Enhancement'
    ];
    alert(`🔧 More Actions: ${sound.name}\n\n${actions.join('\n')}`);
  }

  enableBatchEdit(): void {
    console.log('🔧 Enabling batch edit mode');
    alert('🔧 Batch Edit Mode Activated!\n\nSelect multiple sounds to edit them simultaneously.');
  }

  getAISoundSuggestions(): void {
    console.log('🧠 Getting AI sound suggestions');
    alert(`🧠 AI Sound Suggestions:\n\n• Add more binaural beats for focus\n• Create urban night sounds collection\n• Enhance nature sounds with 3D audio\n• Develop ASMR sleep series`);
  }

  // 📄 PAGINATION METHODS

  getCurrentPageStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredSounds.length);
  }

  getVisiblePages(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  changePageSize(size: string): void {
    this.itemsPerPage = parseInt(size, 10);
    this.currentPage = 1;
  }
}