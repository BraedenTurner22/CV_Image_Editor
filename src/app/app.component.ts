import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageCropperComponent } from "../image-cropper/image-cropper.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageCropperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CV_Image_Editor';
}
