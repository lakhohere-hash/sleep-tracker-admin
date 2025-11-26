import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
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
  showUploadModal: boolean = false;
  playingSound: string | null = null;
  selectedFile: File | null = null;

  // File upload state
  uploadProgress: number = 0;
  isUploading: boolean = false;

  ngOnInit(): void {
    this.loadSounds();
  }

  /**
   * Load sounds data
   */
  loadSounds(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.sounds = this.generateMockSounds();
      this.filteredSounds = [...this.sounds];
      this.isLoading = false;
    }, 1500);
  }

  /**
   * Generate professional mock sounds data
   */
  private generateMockSounds(): Sound[] {
    const baseSounds: Sound[] = [
      {
        id: '1',
        name: 'Ocean Waves Premium',
        description: 'Crystal clear ocean waves recorded in Hawaii with professional mastering',
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
        tags: ['ocean', 'waves', 'sleep', 'calm', 'premium']
      },
      {
        id: '2',
        name: 'Deep Space Meditation',
        description: 'Binaural beats for deep space meditation and focus enhancement',
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
        uploader: 'Sound Engineer Pro',
        tags: ['space', 'meditation', 'binaural', 'deep', 'focus']
      },
      {
        id: '3',
        name: 'City Rain Ambience',
        description: 'Gentle rain in a peaceful city environment for urban relaxation',
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
        tags: ['rain', 'city', 'urban', 'ambient', 'relaxation']
      },
      {
        id: '4',
        name: 'Forest Birds Morning',
        description: 'Morning birds in a dense forest with crystal clear audio quality',
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
        uploader: 'Nature Sounds Pro',
        tags: ['forest', 'birds', 'morning', 'nature', 'wildlife']
      },
      {
        id: '5',
        name: 'Brown Noise Generator',
        description: 'Smooth brown noise for deep focus and concentration',
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
        tags: ['brown-noise', 'focus', 'study', 'white-noise', 'concentration']
      },
      {
        id: '6',
        name: 'ASMR Tibetan Bowls',
        description: 'Healing Tibetan singing bowls ASMR for deep relaxation',
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
        uploader: 'ASMR Master',
        tags: ['asmr', 'tibetan', 'bowls', 'healing', 'relaxation']
      }
    ];

    // Generate additional sounds to reach 260+
    const additionalSounds: Sound[] = [];
    for (let i = 7; i <= 260; i++) {
      additionalSounds.push(this.generateAdditionalSound(i));
    }

    return [...baseSounds, ...additionalSounds];
  }

  /**
   * Generate additional sound data
   */
  private generateAdditionalSound(id: number): Sound {
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
      description: `Professionally mastered ${category} sound for optimal listening experience`,
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
      uploader: Math.random() > 0.5 ? 'Audio Master Pro' : 'Sound Engineer',
      tags: this.generateRandomTags(category)
    };
  }

  /**
   * Generate random tags based on category
   */
  private generateRandomTags(category: string): string[] {
    const tagPools: { [key: string]: string[] } = {
      'nature': ['forest', 'ocean', 'birds', 'water', 'wind', 'animals', 'peaceful', 'natural'],
      'ambient': ['background', 'atmospheric', 'space', 'dreamy', 'ethereal', 'floating', 'calm'],
      'white-noise': ['focus', 'study', 'sleep', 'masking', 'consistent', 'steady', 'concentration'],
      'meditation': ['zen', 'calm', 'mindfulness', 'breathing', 'spiritual', 'healing', 'peace'],
      'urban': ['city', 'traffic', 'people', 'modern', 'metropolitan', 'night', 'environment'],
      'binaural': ['brainwaves', 'focus', 'meditation', 'frequencies', 'hemisphere', 'cognitive'],
      'asmr': ['tingles', 'whisper', 'personal', 'intimate', 'relaxing', 'sleep', 'sensory']
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

  // ==================== CORE METHODS ====================

  /**
   * Get total sounds count
   */
  getTotalSoundsCount(): number {
    return this.sounds.length;
  }

  /**
   * Get premium sounds count
   */
  getPremiumSoundsCount(): number {
    return this.sounds.filter(s => s.premium).length;
  }

  /**
   * Get total plays across all sounds
   */
  getTotalPlays(): number {
    return this.sounds.reduce((total, sound) => total + sound.plays, 0);
  }

  /**
   * Apply search and filter criteria
   */
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

  /**
   * Get paginated sounds for current page
   */
  getPaginatedSounds(): Sound[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSounds.slice(startIndex, endIndex);
  }

  /**
   * Calculate total pages for pagination
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredSounds.length / this.itemsPerPage);
  }

  /**
   * Reset all filters to default
   */
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedPremium = 'all';
    this.applyFilters();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get display name for category
   */
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

  /**
   * Get CSS class for category badge
   */
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

  /**
   * Get CSS class for premium badge
   */
  getPremiumBadgeClass(premium: boolean): string {
    return premium ? 'badge-premium' : 'badge-free';
  }

  /**
   * Calculate sound revenue
   */
  calculateSoundRevenue(): number {
    const premiumPlays = this.sounds
      .filter(s => s.premium)
      .reduce((total, sound) => total + sound.plays, 0);
    
    // Assume $0.001 per premium play
    return Math.round(premiumPlays * 0.001);
  }

  /**
   * Calculate total duration of all sounds
   */
  getTotalDuration(): string {
    const totalMinutes = this.sounds.reduce((total, sound) => {
      if (sound.duration === '∞') return total + 60; // Assume 60 minutes for infinite sounds
      const [minutes, seconds] = sound.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Calculate average quality across all sounds
   */
  getAverageQuality(): number {
    const totalQuality = this.sounds.reduce((total, sound) => total + sound.quality, 0);
    return Math.round(totalQuality / this.sounds.length);
  }

  /**
   * Generate waveform data for visualization
   */
  generateWaveform(): number[] {
    return Array.from({ length: 50 }, () => Math.floor(Math.random() * 80) + 20);
  }

  /**
   * Check if sound is currently playing
   */
  isPlaying(sound: Sound): boolean {
    return this.playingSound === sound.id;
  }

  /**
   * Toggle play/pause for sound
   */
  togglePlay(sound: Sound): void {
    if (this.isPlaying(sound)) {
      this.playingSound = null;
      console.log('⏸️ Paused sound:', sound.name);
    } else {
      this.playingSound = sound.id;
      console.log('▶️ Playing sound:', sound.name);
    }
  }

  // ==================== FILE UPLOAD METHODS ====================

  /**
   * Open upload modal
   */
  openUploadModal(): void {
    this.showUploadModal = true;
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  /**
   * Close upload modal
   */
  closeUploadModal(): void {
    this.showUploadModal = false;
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/aac', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid audio file (MP3, WAV, AAC, OGG)');
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }

      this.selectedFile = file;
      console.log('Selected file:', file.name, file.size, file.type);
    }
  }

  /**
   * Upload selected file
   */
  uploadSoundFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 10;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        
        // Simulate processing time
        setTimeout(() => {
          this.completeUpload();
        }, 1000);
      }
    }, 200);
  }

  /**
   * Complete upload process
   */
  private completeUpload(): void {
    this.isUploading = false;
    
    // Create new sound from uploaded file
    const newSound: Sound = {
      id: (this.sounds.length + 1).toString(),
      name: this.selectedFile?.name.replace(/\.[^/.]+$/, "") || 'New Sound',
      description: 'Uploaded sound file - ready for processing',
      category: 'nature',
      duration: '5:00',
      fileSize: this.formatFileSize(this.selectedFile?.size || 0),
      bitrate: '256kbps',
      premium: false,
      featured: false,
      plays: 0,
      downloads: 0,
      rating: 0,
      quality: 85,
      usage: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: 'Admin',
      tags: ['uploaded', 'new']
    };

    // Add to sounds array
    this.sounds.unshift(newSound);
    this.filteredSounds = [...this.sounds];
    
    console.log('Sound uploaded successfully:', newSound);
    alert('Sound uploaded successfully! The file is now being processed and will be available shortly.');
    
    this.closeUploadModal();
  }

  /**
   * Format file size for display - MAKE THIS PUBLIC
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ==================== ACTION METHODS ====================

  /**
   * Preview sound details
   */
  previewSound(sound: Sound): void {
    console.log('Previewing sound:', sound.name);
    alert(`Sound Preview\n\nName: ${sound.name}\nCategory: ${this.getCategoryDisplayName(sound.category)}\nDuration: ${sound.duration}\nQuality: ${sound.quality}%\nRating: ${sound.rating}/5\nPlays: ${sound.plays.toLocaleString()}`);
  }

  /**
   * Edit sound information
   */
  editSound(sound: Sound): void {
    console.log('Editing sound:', sound.name);
    alert(`Editing Sound: ${sound.name}\n\nSound details editor will open here with advanced audio editing tools.`);
  }

  /**
   * Upgrade sound to premium
   */
  upgradeToPremium(sound: Sound): void {
    console.log('Upgrading sound to premium:', sound.name);
    sound.premium = true;
    alert(`Sound Upgraded to Premium\n\n${sound.name} is now a premium sound and will generate revenue.`);
  }

  /**
   * Toggle featured status
   */
  toggleFeatured(sound: Sound): void {
    console.log('Toggling featured status for:', sound.name);
    sound.featured = !sound.featured;
    alert(`Featured Status Updated\n\n${sound.name} is ${sound.featured ? 'now' : 'no longer'} featured.`);
  }

  /**
   * Show sound analytics
   */
  showSoundAnalytics(sound: Sound): void {
    console.log('Showing analytics for:', sound.name);
    alert(`Sound Analytics: ${sound.name}\n\nPlays: ${sound.plays.toLocaleString()}\nDownloads: ${sound.downloads.toLocaleString()}\nRating: ${sound.rating}/5\nQuality Score: ${sound.quality}%\nUsage Rate: ${sound.usage}%`);
  }

  /**
   * Show more actions menu
   */
  showMoreActions(sound: Sound): void {
    console.log('Showing more actions for:', sound.name);
    const actions = [
      '📊 Detailed Analytics',
      '🎛️ Audio Mastering',
      '📈 Performance Report',
      '🔗 Share Sound',
      '📥 Export Data',
      '⚙️ Sound Settings'
    ];
    alert(`More Actions: ${sound.name}\n\n${actions.join('\n')}`);
  }

  // ==================== PAGINATION METHODS ====================

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
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredSounds.length);
  }

  /**
   * Get visible page numbers for pagination
   */
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
   * Change items per page - FIXED METHOD SIGNATURE
   */
  changePageSize(size: string): void {
    this.itemsPerPage = parseInt(size, 10);
    this.currentPage = 1;
  }
}