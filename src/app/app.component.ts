import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from "./authentication/services/auth.service";
import { FormIsFinishedService } from "./image-editor/services/form-finished.service";

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


  // TODO: move to image cropping component LATER
  objectCreationFormFinished: boolean | null = false;
  private formIsFinishedService = inject(FormIsFinishedService); 

  constructor(private readonly supabaseAuthService: AuthService) {}

  }
