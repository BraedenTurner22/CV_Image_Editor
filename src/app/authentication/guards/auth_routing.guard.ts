// auth-and-profile.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthAndProfileGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // 1. Check if the user is authenticated (has a Supabase session)
    return this.authService.user$.pipe(
      take(1), // Take only the first emission to prevent re-running on every user change
      switchMap((user: User | null) => {
        if (!user) {
          // If no user is logged in, redirect to the login page
          console.warn(
            'AuthAndProfileGuard: No authenticated user. Redirecting to login.'
          );
          return of(
            this.router.createUrlTree(['/login'], {
              queryParams: { redirect_url: state.url },
            })
          );
        } else {
          // If a user is authenticated, proceed to check their profile status
          // This ensures that profile checks only happen for logged-in users.
          return this.authService.profile$.pipe(
            take(1), // Take the current profile state
            map((profile) => {
              // Get the `requiresProfile` data from the route configuration
              const requiresProfile = route.data['requiresProfile'] || false;

              if (requiresProfile && !profile) {
                // If the route explicitly requires a profile, and the user doesn't have one
                console.warn(
                  'AuthAndProfileGuard: User authenticated but profile missing. Redirecting to profile completion.'
                );
                return this.router.createUrlTree(['/complete-profile'], {
                  queryParams: { redirect_url: state.url },
                });
              }

              // If no profile is required, or if a profile exists and is required
              console.log('AuthAndProfileGuard: Access granted.');
              return true;
            })
          );
        }
      })
    );
  }
}