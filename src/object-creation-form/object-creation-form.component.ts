import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormIsFinishedService } from '../form-finished.service';

@Component({
  selector: 'app-object-creation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './object-creation-form.component.html',
  styleUrl: './object-creation-form.component.css'
})
export class ObjectCreationFormComponent implements OnInit {

  objectFormIsOpen: boolean = false;
  formIsFinished: boolean = false;
  objectDict: { [key: number]: string} = {};

  newObjectClass: string = '';
  
  nextKey: number = 0;

  constructor(private FormIsFinishedService: FormIsFinishedService) {}

  ngOnInit(): void {}

  initiateObjectForm() {
    this.objectFormIsOpen = true;
  }

  addObject() {
    if (this.newObjectClass.trim()) {
      this.objectDict[this.nextKey] = this.newObjectClass;
      this.nextKey++;
      this.newObjectClass = '';
    }
  }

  removeObject(key: number) {
    delete this.objectDict[key];
  }

  // Get an array of keys for *ngFor iteration
  getKeys(dict: { [key: number]: string }): number[] {
    return Object.keys(dict).map(key => parseInt(key, 10));
  }

  finishForm() {
    this.formIsFinished = true;
    this.FormIsFinishedService.updateFormStatus(this.formIsFinished);
  }

}


