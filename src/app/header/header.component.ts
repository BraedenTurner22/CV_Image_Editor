import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../authentication/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  user$ = this.authService.user$;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async headerSignOut(): Promise<void> {
    this.loading = true;
    try {
      await this.authService.signOut();
      console.log('authService.signOut() resolved')
      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
      console.log('heaerSignOut() complete, loading = false')
    }
  }
}