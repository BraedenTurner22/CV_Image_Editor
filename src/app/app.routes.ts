// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthAndProfileGuard } from './authentication/guards/auth_routing.guard';
import { PublicGuard } from './authentication/guards/public.guard';


export const routes: Routes = [
  // 1) Home: landing page
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
    canActivate: [PublicGuard],
  },

  // 2) Public auth routes
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then(m => m.SignupComponent),
    canActivate: [PublicGuard],
  },

  // 3) Protected dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./image-dashboard/image-dashboard.component').then(m => m.ImageDashboardComponent),
    canActivate: [AuthAndProfileGuard],
    data: {requiresProfile: true },
  },

  // 4) Catch‐all back to “home”
  { path: '**', redirectTo: '' },
];
