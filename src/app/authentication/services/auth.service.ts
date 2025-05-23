// auth.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { AuthSession, createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Profile {
  id?: string;
  email: string;
  username?: string;
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);

  private _session = new BehaviorSubject<AuthSession | null>(null);
  public readonly session$ = this._session.asObservable();

  private _user = new BehaviorSubject<User | null>(null);
  public readonly user$ = this._user.asObservable();

  private _profile = new BehaviorSubject<Profile | null>(null);
  public readonly profile$ = this._profile.asObservable();

  constructor() {
    // 1. Create Supabase client *outside* Angular's zone.
    // This is crucial to prevent Supabase's internal real-time events from triggering
    // constant change detection cycles in Angular.
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(
        environment.supabase.url,
        environment.supabase.key
      )
    );

    // 2. Initial session check: Bring the update into Angular's zone.
    // We only care about the final state, so this should trigger one change detection.
    this.supabase.auth.getSession().then(async ({ data: { session } }) => {
      this.ngZone.run(async () => { // <--- Explicitly run in NgZone
        this._session.next(session);
        this._user.next(session?.user ?? null);
        if (session?.user) {
          const profile = await this.getProfile(session.user.id);
          this._profile.next(profile);
        } else {
          this._profile.next(null);
        }
        console.log('AuthService: Initial session loaded in zone.');
      });
    });

    // 3. Listen for auth state changes: Bring *only the state updates* into Angular's zone.
    // The `onAuthStateChange` callback itself runs outside the zone, but `this.ngZone.run`
    // will ensure Angular is aware of the state changes.
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.ngZone.run(async () => { // <--- Explicitly run in NgZone
        console.log('AuthService: onAuthStateChange event in zone:', event);
        this._session.next(session);
        this._user.next(session?.user ?? null);

        if (session?.user) {
          const profile = await this.getProfile(session.user.id);
          this._profile.next(profile);
        } else {
          this._profile.next(null);
        }
      });
    });
  }

  // Auth methods: These are typically called from Angular components (which are in the zone),
  // so their promises resolving *should* trigger change detection if the component is awaiting.
  // However, for maximum safety, you *could* wrap the `.then()` part of their internal promises
  // in `ngZone.run()` if you continue to see issues, but often it's not strictly necessary here.

  async registerUser(email: string, password: string) {
    try {
      // Supabase's `signUp` method is an async operation.
      // The result of this promise needs to be handled.
      const response = await this.supabase.auth.signUp({ email, password });
      // The `onAuthStateChange` listener will eventually handle updating _session/_user
      // via its `ngZone.run` block, so direct updates here are not strictly needed.
      if (response.error) {
        throw response.error;
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await this.supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        throw response.error;
      }
      return response.data;
    } catch (error: any) {
      console.error('Sign-in error:', error.message);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Sign-out error:', error.message);
      throw error;
    } finally {
      console.log("User signed out");
    }
  }

  // getCurrentUser, getSession, getProfile, updateProfile methods as before...
  // For `updateProfile`, make sure the `_profile.next()` update is in the zone:
  async updateProfile(profile: Profile): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      this.ngZone.run(() => { // <--- Explicitly run in NgZone for this update
        this._profile.next(data as Profile);
      });
      return data as Profile;
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error.message);
      return null;
    }
    return user;
  }

  async getSession(): Promise<AuthSession | null> {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }
    return session;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data as Profile;
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
  }

  async profileAlreadyExists(email: string | null | undefined): Promise<boolean> {
    //Checks if profile already exists based on user signing in with email
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking email', error);
      throw error;
    }
    // if data is non-null, there’s a matching row
    return data !== null;
  }
}