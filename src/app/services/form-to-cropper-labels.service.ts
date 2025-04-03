import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormToCropperLabelsService {
  //Holds the latest data; initial value can be null or an empty string
  private objectDictSource = new BehaviorSubject<{ [key: string]: any }>({});

  //Observable components subscribe to
  objectDict$ = this.objectDictSource.asObservable();

  updateCropperLabels(dict: { [key: string]: any }) {
    this.objectDictSource.next(dict);
  }
}
