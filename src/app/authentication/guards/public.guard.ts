// src/app/authentication/guards/public.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      take(1), // Get the current user status once
      map((user) => {
        if (user) {
          // If a user is authenticated, redirect them away from public pages
          console.warn('PublicGuard: User is authenticated. Redirecting to dashboard.');
          return this.router.createUrlTree(['/dashboard']);
        }
        // If no user is authenticated, allow access to the public page
        console.log('PublicGuard: No authenticated user. Allowing access.');
        return true;
      })
    );
  }
}