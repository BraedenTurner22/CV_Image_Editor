import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../authentication/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = false;
  authError?: string = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;

      delete this.authError;

      const { email, password } = this.loginForm.value;
      this.authService.signIn(email!, password!)
        .then(() => {
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          this.authError = err?.message || 'An unexpected error occurred during login.';
          console.error('Login error:', err); // Log the full error for debugging
        })
        .finally(() => { // Use .finally() to ensure loading state is always reset
          this.loading = false;
        });
    }
  }
}
