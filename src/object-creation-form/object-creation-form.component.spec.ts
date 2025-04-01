import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCreationFormComponent } from './object-creation-form.component';

describe('ObjectCreationFormComponent', () => {
  let component: ObjectCreationFormComponent;
  let fixture: ComponentFixture<ObjectCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectCreationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
