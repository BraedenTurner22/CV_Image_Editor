import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements AfterViewInit {
  @ViewChild('image', { static: false }) imageElement!: ElementRef;
  @ViewChild('dropArea', { static: false }) dropArea!: ElementRef;
  cropper!: Cropper;
  imageUrl: string | null = null;

  ngAfterViewInit() {
    this.setupDragAndDrop();
  }

  setupDragAndDrop() {
    const dropArea = this.dropArea.nativeElement;
    
    dropArea.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      dropArea.classList.remove('drag-over');

      if (event.dataTransfer?.files.length) {
        this.loadImage(event.dataTransfer.files[0]);
      }
    });
  }

  loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrl = e.target?.result as string;
      setTimeout(() => this.initializeCropper(), 100); // Ensure image is loaded before initializing cropper
    };
    reader.readAsDataURL(file);
  }

  initializeCropper() {
    if (this.cropper) {
      this.cropper.reset();
    }
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      aspectRatio: 1, // Change as needed
      viewMode: 1,
      autoCrop: true
    });
  }

  cropImage() {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas();
      const croppedImageURL = croppedCanvas.toDataURL('image/png');
      console.log(croppedImageURL); // You can display, download, or upload the cropped image
    }
  }
}
