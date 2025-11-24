import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// 🎯 MOCK INTERCEPTORS (For demo purposes)
const authInterceptor = (req: any, next: any) => {
  // Add auth token to all requests
  const authReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer mock-jwt-token')
  });
  return next(authReq);
};

const loggingInterceptor = (req: any, next: any) => {
  console.log(`🚀 API Call: ${req.method} ${req.url}`);
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: (transitionInfo) => {
          console.log('🎬 Route transition:', transitionInfo);
        }
      })
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor, loggingInterceptor])
    )
  ]
};