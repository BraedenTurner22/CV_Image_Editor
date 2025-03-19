import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
