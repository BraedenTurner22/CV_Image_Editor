import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDashboardComponent } from './image-dashboard.component';

describe('ImageDashboardComponent', () => {
  let component: ImageDashboardComponent;
  let fixture: ComponentFixture<ImageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
