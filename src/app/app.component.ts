import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getMainNavigationRoutes, getBreadcrumbTrail, QUICK_NAV } from './app.routes';

interface NavigationItem {
  path: string;
  title: string;
  description: string;
  icon: string;
  requiresAdmin: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- LEGENDARY SLEEP TRACKER ADMIN PANEL -->
    <div class="app-container">
      <!-- Main Router Outlet -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SleepTracker Pro - Legendary Admin';
  navigationItems: NavigationItem[] = [];
  currentBreadcrumb: any[] = [];
  isAuthenticated = true; // Mock auth state
  isAdmin = true; // Mock admin state

  constructor(private router: Router) {}

  ngOnInit() {
    this.setupRouterEvents();
    this.loadNavigation();
  }

  private setupRouterEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('📍 Navigation to:', event.url);
        this.currentBreadcrumb = getBreadcrumbTrail(event.url);
        this.trackPageView(event.url);
      }
    });
  }

  private loadNavigation() {
    this.navigationItems = getMainNavigationRoutes();
    console.log('🧭 Loaded navigation:', this.navigationItems);
  }

  private trackPageView(url: string) {
    // Analytics tracking would go here
    console.log('📊 Page view tracked:', url);
  }

  // 🎯 QUICK NAVIGATION METHODS
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  quickNavigate(destination: keyof typeof QUICK_NAV) {
    this.navigateTo(QUICK_NAV[destination]);
  }

  // 🚀 MALIK'S SPECIAL NAVIGATION FEATURES
  navigateToDashboard() {
    this.quickNavigate('DASHBOARD');
    console.log('🚀 Quick nav to dashboard');
  }

  navigateToSettings() {
    this.quickNavigate('SETTINGS');
    console.log('⚙️ Quick nav to settings');
  }

  navigateToAnalytics() {
    this.quickNavigate('ANALYTICS');
    console.log('📈 Quick nav to analytics');
  }

  // 🎯 ROUTE UTILITIES
  getCurrentRoute() {
    return this.router.url;
  }

  isActiveRoute(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  // 🔒 AUTH UTILITIES
  canAccessRoute(requiresAdmin: boolean): boolean {
    if (requiresAdmin) {
      return this.isAuthenticated && this.isAdmin;
    }
    return this.isAuthenticated;
  }
}