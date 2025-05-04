// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './authentication/guards/auth-guard.guard';

export const routes: Routes = [
  // 1) Home: landing page
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
    canActivate: [AuthGuard],
  },

  // 2) Public auth routes
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then(m => m.SignupComponent),
  },

  // 3) Protected dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./image-dashboard/image-dashboard.component').then(m => m.ImageDashboardComponent),
    canActivate: [AuthGuard],
  },

  // 4) Catch‐all back to “home”
  { path: '**', redirectTo: '' },
];
