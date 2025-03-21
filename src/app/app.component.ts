import { Component } from '@angular/core';
import { ImageCropperComponent} from "../image-cropper/image-cropper.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageCropperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
