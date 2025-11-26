import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { SoundsComponent } from './sounds/sounds.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { GiftCodesComponent } from './gift-codes/gift-codes.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { AiStudioComponent } from './components/ai-studio/ai-studio.component';

// 🎯 Route Data Interface for Type Safety
interface RouteData {
  title?: string;
  description?: string;
  icon?: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  breadcrumb?: string;
  hidden?: boolean;
}

// 🎯 LEGENDARY ROUTE GUARDS (Mock implementation)
const isAuthenticated = () => {
  return true; // Always authenticated for demo
};

const hasAdminAccess = () => {
  return true; // Always admin for demo
};

export const routes: Routes = [
  // 🏠 Public Routes
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full',
    data: {
      title: 'Welcome',
      description: 'Redirect to login page',
      icon: '🏠'
    } as RouteData
  },
  { 
    path: 'login', 
    component: LoginComponent,
    data: {
      title: 'Login',
      description: 'Secure admin authentication',
      icon: '🔐',
      requiresAuth: false
    } as RouteData
  },

  // 🛡️ Protected Admin Routes
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [isAuthenticated],
    data: {
      title: 'Dashboard',
      description: 'Business intelligence overview',
      icon: '📊',
      requiresAuth: true,
      breadcrumb: 'Dashboard'
    } as RouteData
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: '👥',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Users'
    } as RouteData
  },
  { 
    path: 'sounds', 
    component: SoundsComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Sounds Library',
      description: 'Manage 260+ premium sleep sounds',
      icon: '🎵',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Sounds'
    } as RouteData
  },
  { 
    path: 'subscriptions', 
    component: SubscriptionsComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Subscriptions',
      description: 'Revenue and payment management',
      icon: '💎',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Subscriptions'
    } as RouteData
  },
  { 
    path: 'gift-codes', 
    component: GiftCodesComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Gift Codes',
      description: 'Viral growth code management',
      icon: '🎁',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Gift Codes'
    } as RouteData
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Analytics',
      description: 'Business intelligence and reporting',
      icon: '📈',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Analytics'
    } as RouteData
  },
  { 
    path: 'notifications', 
    component: NotificationsComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Notifications',
      description: 'Multi-channel communication system',
      icon: '🔔',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Notifications'
    } as RouteData
  },
  { 
    path: 'settings', 
    component: SettingsComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'Settings',
      description: 'Enterprise configuration and security',
      icon: '⚙️',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Settings'
    } as RouteData
  },
  // 🚀 AI STUDIO ROUTE - ADDED!
  { 
    path: 'ai-studio', 
    component: AiStudioComponent,
    canActivate: [isAuthenticated, hasAdminAccess],
    data: {
      title: 'AI Studio',
      description: 'Machine learning and predictions',
      icon: '🤖',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'AI Studio'
    } as RouteData
  },

  // 🚀 Feature Routes (Future Expansion)
  { 
    path: 'reports', 
    redirectTo: '/analytics',
    data: {
      title: 'Reports',
      description: 'Advanced reporting system',
      icon: '📋',
      hidden: true
    } as RouteData
  },
  { 
    path: 'billing', 
    redirectTo: '/subscriptions',
    data: {
      title: 'Billing',
      description: 'Billing and invoice management',
      icon: '🧾',
      hidden: true
    } as RouteData
  },

  // 🌟 Catch-all Route (Must be last)
  { 
    path: '**', 
    redirectTo: '/dashboard',
    data: {
      title: 'Unknown Route',
      description: 'Catch all unknown routes',
      icon: '🔄',
      hidden: true
    } as RouteData
  }
];

// 🎯 ROUTE UTILITIES FOR NAVIGATION
export const getRouteConfig = (path: string): RouteData => {
  const route = routes.find(r => r.path === path);
  return route?.data || {};
};

export const getMainNavigationRoutes = () => {
  return routes.filter(route => {
    const data = route.data as RouteData;
    return data && 
           data.requiresAuth && 
           !data.hidden &&
           route.path !== '' &&
           route.path !== 'dashboard';
  }).map(route => {
    const data = route.data as RouteData;
    return {
      path: `/${route.path}`,
      title: data['title'] || 'Untitled',
      description: data['description'] || 'No description',
      icon: data['icon'] || '⚙️',
      requiresAdmin: data['requiresAdmin'] || false
    };
  });
};

export const getBreadcrumbTrail = (currentPath: string) => {
  const trail: Array<{label: string; path: string; icon: string}> = [];
  const pathSegments = currentPath.split('/').filter(segment => segment);
  
  let currentRoute = '';
  for (const segment of pathSegments) {
    currentRoute += `/${segment}`;
    const route = routes.find(r => r.path === segment || r.path === currentRoute.replace('/', ''));
    const data = route?.data as RouteData;
    if (route && data && data.breadcrumb) {
      trail.push({
        label: data.breadcrumb,
        path: currentRoute,
        icon: data.icon || '📄'
      });
    }
  }
  
  return trail;
};

// 🚀 QUICK NAVIGATION HELPERS
export const QUICK_NAV = {
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SOUNDS: '/sounds',
  SUBSCRIPTIONS: '/subscriptions',
  GIFT_CODES: '/gift-codes',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  AI_STUDIO: '/ai-studio', // 🆕 ADDED AI STUDIO!
  LOGIN: '/login'
} as const;