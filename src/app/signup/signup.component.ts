import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../authentication/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordsMatchValidator
  });

  loading = false;
  authError?: string = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {}

  private passwordsMatchValidator(group: any) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordsMismatch: true };
  }

  async onSubmit(): Promise<void> {
    const { email, password } = this.signupForm.value;
    
    //checks if email already exists in a profile, returns null if not
    if (this.authService.profileAlreadyExists(email) != null) {
      this.authError = "An account with this email already exists. Please log in.";
    }

    else if (this.signupForm.valid) {
      this.loading = true;
      delete this.authError;

      this.authService.registerUser(email!, password!)
        .then(() => {
          this.router.navigate(['/dashboard']);
          this.loading = false;
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
