import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesFileUploadItemComponent } from './penalties-file-upload-item.component';

describe('PenaltiesFileUploadItemComponent', () => {
  let component: PenaltiesFileUploadItemComponent;
  let fixture: ComponentFixture<PenaltiesFileUploadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltiesFileUploadItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesFileUploadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
