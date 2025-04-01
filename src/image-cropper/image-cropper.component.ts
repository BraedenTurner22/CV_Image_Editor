import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageLabelGenerator } from "../image-label-generator.service"

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent {
  img!: HTMLImageElement;
  imageUrl: string = '';
  imageName: string = '';
  croppedImage: any = '';

    imageNaturalWidth: number = 0;
  imageNaturalHeight: number = 0;

  // Variables for tracking drag coordinates
  dragging = false;
  cropRect = { left: 0, top: 0, width: 0, height: 0 };
  startX = 0;
  startY = 0;

  constructor(private ImageLabelGenerator: ImageLabelGenerator) {}

  // Loads the image and sets the imageUrl property
  fileChangeEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageName = file.name;
      const reader = new FileReader();
      reader.onload = () => (this.imageUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Called on mousedown: starts the crop selection
  startCrop(event: MouseEvent): void {
    this.dragging = true;
    // Get the position within the container
    const containerRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.startX = event.clientX - containerRect.left;
    this.startY = event.clientY - containerRect.top;
    this.cropRect = { left: this.startX, top: this.startY, width: 0, height: 0 };
  }

  // Called as the mouse moves: updates the selection rectangle
  onCrop(event: MouseEvent): void {
    if (!this.dragging) {
      return;
    }
    const containerRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const currentX = event.clientX - containerRect.left;
    const currentY = event.clientY - containerRect.top;
    
    // Calculate normalized coordinates and dimensions:
    this.cropRect.left = Math.min(this.startX, currentX);
    this.cropRect.top = Math.min(this.startY, currentY);
    this.cropRect.width = Math.abs(currentX - this.startX);
    this.cropRect.height = Math.abs(currentY - this.startY);
  }
  

  // Called when the mouse is released or leaves the container: finalizes the crop
  endCrop(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      this.cropImage();
    }
  }

  // Uses an off-screen canvas to crop the image based on the selection  
  cropImage(): void {
    this.img = new Image();
    this.img.src = this.imageUrl;
    this.img.onload = () => {

      this.imageNaturalWidth = this.img.naturalWidth;
      this.imageNaturalHeight = this.img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = this.cropRect.width;
      canvas.height = this.cropRect.height;
      const ctx = canvas.getContext('2d');
      // Draw the selected area using the normalized cropRect values:
      ctx?.drawImage(this.img, this.cropRect.left, this.cropRect.top, this.cropRect.width, this.cropRect.height, 0, 0, this.cropRect.width, this.cropRect.height);
      this.croppedImage = canvas.toDataURL('image/png');
    }
  }
  

  generateLabel(): void {
    const centerX = (this.cropRect.left + this.cropRect.width / 2) / this.imageNaturalWidth;
    const centerY = (this.cropRect.top + this.cropRect.height / 2) / this.imageNaturalHeight;
    const croppedImageRelativeWidth: number = this.cropRect.width / this.imageNaturalWidth
    const croppedImageRelativeHeight: number = this.cropRect.height / this.imageNaturalHeight

    // YOLO text file
    const label = `0 ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${croppedImageRelativeWidth.toFixed(6)} ${croppedImageRelativeHeight.toFixed(6)}`;
    console.log(`YOLO coords ${label}`)

    this.ImageLabelGenerator.updateFileData(label, this.imageName)
  }
}
