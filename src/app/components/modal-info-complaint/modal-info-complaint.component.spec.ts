import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoComplaintComponent } from './modal-info-complaint.component';

describe('ModalInfoComplaintComponent', () => {
  let component: ModalInfoComplaintComponent;
  let fixture: ComponentFixture<ModalInfoComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInfoComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInfoComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
