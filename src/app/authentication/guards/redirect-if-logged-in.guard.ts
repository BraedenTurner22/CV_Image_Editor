// src/app/guards/redirect-if-logged-in.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfLoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const user = await this.auth.getCurrentUser();

    // If the user is already logged in, redirect to /dashboard
    if (user) {
      return this.router.parseUrl('/dashboard');
    }

    // Otherwise, allow navigation to /login or /signup
    return true;
  }
}
