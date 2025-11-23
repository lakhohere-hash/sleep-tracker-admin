export const environment = {
  production: false,
  apiUrl: 'https://sleep-tracker-backend-0a9f.onrender.com/api',
  adminUrl: 'https://sleep-tracker-backend-0a9f.onrender.com/admin',
  appName: 'SleepTracker PRO Admin',
  version: '1.0.0',
  mockData: false, // ← CRITICAL: Switch to REAL data
  features: {
    realTimeAnalytics: true,
    soundManagement: true,
    userManagement: true,
    subscriptionSystem: true,
    giftCodes: true,
    pushNotifications: true,
    youtubeIntegration: true
  }
};