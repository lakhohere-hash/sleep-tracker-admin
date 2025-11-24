export const environment = {
  production: true,
  apiUrl: 'https://sleep-tracker-backend-0a9f.onrender.com/api',
  adminUrl: 'https://sleep-tracker-backend-0a9f.onrender.com/admin',
  appName: 'SleepTracker PRO Admin',
  version: '1.0.0',
  mockData: false, // ← REAL data in production too
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