import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from "./authentication/services/auth.service";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {

  constructor(private readonly supabaseAuthService: AuthService) {}

  }
