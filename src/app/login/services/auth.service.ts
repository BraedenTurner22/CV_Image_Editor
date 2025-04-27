import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  
  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
    
    // Initializes user on startup
    this.initializeUser();
    
    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }
  
  private async initializeUser() {
    const { data } = await this.supabase.auth.getSession();
    this.userSubject.next(data.session?.user ?? null);
  }
  
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ 
      email, 
      password 
    });
    if (error) throw error;
    return data.user;
  }
  
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    if (error) throw error;
    return data.user;
  }
  
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.userSubject.next(null);
  }
}