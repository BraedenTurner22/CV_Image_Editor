import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImageLabelGeneratorService {
  //Holds the latest data; initial value can be null or an empty string
  private fileDataSource = new BehaviorSubject<string | null>(null);
  private fileNameSource = new BehaviorSubject<string | null>(null);

  //Observable components subscribe to
  fileData$ = this.fileDataSource.asObservable();
  fileName$ = this.fileNameSource.asObservable();

  updateFileData(data: string, name: string) {
    this.fileDataSource.next(data);
    this.fileNameSource.next(name);
  }
}
