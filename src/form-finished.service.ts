import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs"

@Injectable ({
    providedIn: 'root'
})
export class FormIsFinishedService {
    //Holds the latest data; initial value can be null or an empty string
    private formOpenSource = new BehaviorSubject<boolean | null>(null);
    
    //Observable components subscribe to
    formOpen$ = this.formOpenSource.asObservable();

    updateFormStatus(data: boolean) {
        this.formOpenSource.next(data);
    }
}