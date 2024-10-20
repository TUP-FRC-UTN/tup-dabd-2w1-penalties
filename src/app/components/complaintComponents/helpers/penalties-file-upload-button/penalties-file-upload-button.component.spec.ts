import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesFileUploadButtonComponent } from './penalties-file-upload-button.component';

describe('PenaltiesFileUploadButtonComponent', () => {
  let component: PenaltiesFileUploadButtonComponent;
  let fixture: ComponentFixture<PenaltiesFileUploadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltiesFileUploadButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesFileUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
