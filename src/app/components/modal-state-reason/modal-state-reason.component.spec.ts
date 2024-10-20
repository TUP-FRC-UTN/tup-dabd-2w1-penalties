import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStateReasonComponent } from './modal-state-reason.component';

describe('ModalStateReasonComponent', () => {
  let component: ModalStateReasonComponent;
  let fixture: ComponentFixture<ModalStateReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStateReasonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalStateReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
