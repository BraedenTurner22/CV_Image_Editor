import { Component } from '@angular/core';
import { ImageCropperComponent} from "../image-cropper/image-cropper.component";
import { ImageLabelsComponent } from "../image-labels/image-labels.component";
import { ObjectCreationFormComponent } from '../object-creation-form/object-creation-form.component';
import { FormIsFinishedService } from '../form-finished.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageCropperComponent, ImageLabelsComponent, ObjectCreationFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  objectCreationFormFinished: boolean | null = false;

  constructor(private FormIsFinishedService: FormIsFinishedService) {}

ngOnInit(): void {
  this.FormIsFinishedService.formOpen$.subscribe(data => {
    this.objectCreationFormFinished = data;
  });
}
}
