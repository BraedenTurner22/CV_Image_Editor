import { Injectable } from '@angular/core';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import { BehaviorSubject, first, Observable, skipWhile } from 'rxjs';
import { SupabaseService } from './supabase-service.service';

export interface Profile {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Supabase user state
  private _$user = new BehaviorSubject<User | null | undefined>(undefined);
  $user = this._$user.pipe(skipWhile(_ => typeof _ === 'undefined')) as Observable<User | null>;
  private id?: string;

  // Profile state
  private _$profile = new BehaviorSubject<Profile | null | undefined>(undefined);
  $profile = this._$profile.pipe(skipWhile(_ => typeof _ === 'undefined')) as Observable<Profile | null>;
  private profile_subscription?: RealtimeChannel;

  constructor(private supabase: SupabaseService) {

    // Initialize Supabase user
    // Get initial user from the current session, if it exists
    this.supabase.client.auth.getUser().then(({ data, error }) => {
      this._$user.next(data && data.user && !error ? data.user : null);

      // After the initial value is set, listen for auth state changes (sign in/sign out)
      this.supabase.client.auth.onAuthStateChange((event, session) => {
        this._$user.next(session?.user ?? null);
      });
    });

    // Initialize the user's profile
    // The state of the user's profile is dependent on there being a user. If no user is set, there shouldn't be a profile.
    this.$user.subscribe(user => {
      if (user) {
        // We only make changes if the user is different
      if (user.id !== this.id) {
        const id = user.id;
        this.id = id;

        // One-time API call to Supabase to get the user's profile
        this.supabase.client.from('profiles').select('*').match({ id }).single().then(res => {
          
          //Update our profile Behavior Subject with the current value
          this._$profile.next(res.data ?? null);

          //Listen to any changes to our user's profile using Supabase Realtime
          this.profile_subscription = this.supabase
          .client
          .channel('public:profiles')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: 'id=eq.' + user.id}, (payload: any) => {

              //Update our profile Behavior Subject with the newest value
              this._$profile.next(payload.new);

            })
            .subscribe()

          })
        }
      }
      else {
        // If there is no user, update the profile BehaviorSubject, delete the user's id (id), and unsubscribe from the Supabase Realtime
        this._$profile.next(null);
        delete this.id;
        if (this.profile_subscription) {
          this.supabase.client.removeChannel(this.profile_subscription).then(res => {
            console.log('Removed profile channel subscription with status: ', res);
          });
        }
      }
    })

    //Since our _$profile BehaviorSubject is dependent on the $user Observable,
    // when we sign out our user, the _$profile is automatically updated.
    // We can now use the $profile Observable everywhere in our app.

    //End of constructor
    }


  //Registering account
  registerUser(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      this.supabase.client.auth.signUp({ email, password })
        .then(({ data, error }) => {
          if (error != null || data == null) return reject(new Error('User couldn\'t be registered'));
          this.$profile.pipe(first()).subscribe(() => resolve());
        })
        .catch(error => reject(error));
    });
  }

  //Sign In
  signIn(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
  
      // Set _$profile back to undefined. This will mean that $profile will wait to emit a value
      this._$profile.next(undefined);
      this.supabase.client.auth.signInWithPassword({ email, password })
        .then(({ data, error }) => {
          if (error || !data) return reject(new Error('Invalid email/password combination'));
  
          // Wait for $profile to be set again.
          // We don't want to proceed until our API request for the user's profile has completed
          this.$profile.pipe(first()).subscribe(() => {
            resolve();
          });
        })
    })
  }


  //Sign Out
  signOut() {
    return this.supabase.client.auth.signOut();
  }
}