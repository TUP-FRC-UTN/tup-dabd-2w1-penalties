import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesRegisterComplaintsComponent } from './penalties-register-complaints.component';

describe('PenaltiesRegisterComplaintsComponent', () => {
  let component: PenaltiesRegisterComplaintsComponent;
  let fixture: ComponentFixture<PenaltiesRegisterComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltiesRegisterComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesRegisterComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
