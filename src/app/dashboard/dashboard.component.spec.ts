import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Mock services
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockAuthService = {
  logout: jasmine.createSpy('logout'),
  getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ 
    name: 'Test Admin', 
    email: 'admin@test.com' 
  })
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockRouter.navigate.calls.reset();
    mockAuthService.logout.calls.reset();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty stats', () => {
    expect(component.stats.totalUsers).toBe(0);
    expect(component.stats.activeSubscriptions).toBe(0);
    expect(component.stats.totalSleepSessions).toBe(0);
  });

  it('should set isLoading to true on initialization', () => {
    expect(component.isLoading).toBe(true);
  });

  it('should load current admin user', () => {
    expect(component.currentAdmin).toEqual({ name: 'Test Admin', email: 'admin@test.com' });
  });

  it('should load dashboard data after initialization', (done) => {
    setTimeout(() => {
      expect(component.stats.totalUsers).toBe(1250);
      expect(component.stats.activeSubscriptions).toBe(342);
      expect(component.stats.monthlyRevenue).toBe(2977.02);
      expect(component.isLoading).toBe(false);
      done();
    }, 1600);
  });

  it('should load recent activities', (done) => {
    setTimeout(() => {
      expect(component.recentActivities.length).toBe(5);
      expect(component.recentActivities[0].user).toBe('John Doe');
      expect(component.recentActivities[0].action).toBe('Premium Subscription');
      done();
    }, 1600);
  });

  it('should navigate to different routes', () => {
    component.navigateTo('users');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);

    component.navigateTo('sounds');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sounds']);
  });

  it('should call specific navigation methods', () => {
    component.navigateToUsers();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);

    component.navigateToSounds();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sounds']);
  });

  it('should logout user', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(1234.56)).toBe('$1,234.56');
    expect(component.formatCurrency(0)).toBe('$0.00');
    expect(component.formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('should format numbers correctly', () => {
    expect(component.formatNumber(1234)).toBe('1,234');
    expect(component.formatNumber(0)).toBe('0');
    expect(component.formatNumber(1000000)).toBe('1,000,000');
  });

  it('should handle navigation with empty route', () => {
    component.navigateTo('');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});