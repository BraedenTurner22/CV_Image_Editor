import { Component } from '@angular/core';
import { ImageCropperComponentStandalone } from "../image-cropper/image-cropper.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageCropperComponentStandalone],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
