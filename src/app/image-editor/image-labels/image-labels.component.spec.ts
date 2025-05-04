import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLabelsComponent } from './image-labels.component';

describe('ImageLabelsComponent', () => {
  let component: ImageLabelsComponent;
  let fixture: ComponentFixture<ImageLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLabelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
