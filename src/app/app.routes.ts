// src/app/app-routing.module.ts
import { Routes } from '@angular/router';

import { AuthGuard } from './authentication/guards/auth.guard';
import { RedirectIfLoggedInGuard } from './authentication/guards/redirect-if-logged-in.guard';

export const routes: Routes = [
  // 1) Home: landing page
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
    canActivate: [RedirectIfLoggedInGuard],
  },

  // 2) Public auth routes (redirect to dashboard if already logged in)
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [RedirectIfLoggedInGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then(m => m.SignupComponent),
    canActivate: [RedirectIfLoggedInGuard],
  },

  // 3) Protected dashboard (redirect to login if not authenticated)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./image-dashboard/image-dashboard.component').then(m => m.ImageDashboardComponent),
    canActivate: [AuthGuard],
    data: { requiresProfile: true },
  },

  // 4) Catch‐all back to “home”
  { path: '**', redirectTo: '' },
];
