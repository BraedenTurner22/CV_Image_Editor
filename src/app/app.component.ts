import { Component } from "@angular/core";
import { ImageCropperComponent } from "../image-cropper/image-cropper.component";
import { ImageLabelsComponent } from "../image-labels/image-labels.component";
import { ObjectCreationFormComponent } from "../object-creation-form/object-creation-form.component";
import { FormIsFinishedService } from "./services/form-finished.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    ImageCropperComponent,
    ImageLabelsComponent,
    ObjectCreationFormComponent,
    CommonModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  objectCreationFormFinished: boolean | null = false;

  constructor(private FormIsFinishedService: FormIsFinishedService) {}

  ngOnInit(): void {
    this.FormIsFinishedService.formOpen$.subscribe((data) => {
      this.objectCreationFormFinished = data;
    });
  }
}
