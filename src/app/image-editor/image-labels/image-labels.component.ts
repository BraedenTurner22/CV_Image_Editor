import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-image-labels",
  imports: [CommonModule],
  templateUrl: "./image-labels.component.html",
  styleUrls: ["./image-labels.component.css"],
})
export class ImageLabelsComponent implements OnInit {
  fileContent: string | null = null;
  fileName: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  downloadFile() {
    if (this.fileContent && this.fileName) {
      const blob = new Blob([this.fileContent], {
        type: "text/plain;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement(`a`);
      link.href = url;

      // Replace the file extension with .txt or append .txt if none exists
      const txtFileName = this.fileName.includes(".")
        ? this.fileName.replace(/\.[^/.]+$/, ".txt")
        : this.fileName + ".txt";

      link.download = txtFileName;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
