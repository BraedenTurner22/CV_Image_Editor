import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-dashboard',
  imports: [CommonModule],
  templateUrl: './image-dashboard.component.html',
  styleUrl: './image-dashboard.component.css'
})
export class ImageDashboardComponent {

  userAlreadyHasProject: boolean = false;

  img!: HTMLImageElement;
  imageUrl: string = "";
  imageName: string = "";


  // Loads the image and sets the imageUrl property
  fileChangeEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is a valid image type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG or PNG)');
        return;
      }
      
      this.imageName = file.name;
      const reader = new FileReader();
      reader.onload = () => (this.imageUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
}
