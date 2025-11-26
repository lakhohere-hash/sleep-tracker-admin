import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getMainNavigationRoutes, getBreadcrumbTrail, QUICK_NAV } from './app.routes';

interface NavigationItem {
  id: string; // ADDED THIS PROPERTY
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SleepTracker Pro - Enterprise Admin';
  navigationItems: NavigationItem[] = [];
  currentBreadcrumb: any[] = [];
  isAuthenticated = true;
  isAdmin = true;
  isLoading = false;
  showMobileMenu = false;
  isMobileView = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.setupRouterEvents();
    this.loadNavigation();
    this.checkMobileView();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  private setupRouterEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation to:', event.url);
        this.currentBreadcrumb = getBreadcrumbTrail(event.url);
        this.trackPageView(event.url);
        this.closeMobileMenu();
      }
    });
  }

  private loadNavigation() {
    const routes = getMainNavigationRoutes();
    // Add id property to each navigation item
    this.navigationItems = routes.map(item => ({
      ...item,
      id: this.generateIdFromTitle(item.title) // Generate id from title
    }));
    console.log('Loaded navigation:', this.navigationItems);
  }

  private generateIdFromTitle(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  private checkMobileView() {
    this.isMobileView = window.innerWidth < 768;
  }

  private trackPageView(url: string) {
    console.log('Page view tracked:', url);
  }

  // Navigation Methods
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  quickNavigate(destination: keyof typeof QUICK_NAV) {
    this.navigateTo(QUICK_NAV[destination]);
  }

  // Quick Navigation Features
  navigateToDashboard() {
    this.quickNavigate('DASHBOARD');
  }

  navigateToSettings() {
    this.quickNavigate('SETTINGS');
  }

  navigateToAnalytics() {
    this.quickNavigate('ANALYTICS');
  }

  // Mobile Menu Methods
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  // Route Utilities
  getCurrentRoute() {
    return this.router.url;
  }

  isActiveRoute(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  // Auth Utilities
  canAccessRoute(requiresAdmin: boolean): boolean {
    if (requiresAdmin) {
      return this.isAuthenticated && this.isAdmin;
    }
    return this.isAuthenticated;
  }
}