import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FormIsFinishedService } from "../form-finished.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-object-creation-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./object-creation-form.component.html",
  styleUrl: "./object-creation-form.component.css",
})
export class ObjectCreationFormComponent implements OnInit {
  newProjectCreated: boolean = false;
  objectFormIsOpen: boolean = false;
  formIsFinished: boolean = false;
  objectDict: { [key: number]: string } = {};
  errorMessage: string = "";

  newObjectClass: string = "";

  nextKey: number = 0;

  constructor(private FormIsFinishedService: FormIsFinishedService) {}

  ngOnInit(): void {}

  initiateObjectForm() {
    this.newProjectCreated = true;
    this.objectFormIsOpen = true;
  }

  addObject() {
    if (this.newObjectClass.trim()) {
      const valueExists = Object.values(this.objectDict).includes(
        this.newObjectClass
      );
      if (!valueExists) {
        this.objectDict[this.nextKey] = this.newObjectClass;
        this.nextKey++;
        this.newObjectClass = "";
      } else {
        this.errorMessage =
          "Class name already exists, please pick a different name";
      }
    } else {
      this.errorMessage = "Class name cannot be empty, please pick a name";
    }
  }

  removeObject(key: number) {
    delete this.objectDict[key];
  }

  // Get an array of keys for *ngFor iteration
  getKeys(dict: { [key: number]: string }): number[] {
    return Object.keys(dict).map((key) => parseInt(key, 10));
  }

  finishForm() {
    this.formIsFinished = true;
    this.FormIsFinishedService.updateFormStatus(this.formIsFinished);
    this.objectFormIsOpen = false;
  }
}
