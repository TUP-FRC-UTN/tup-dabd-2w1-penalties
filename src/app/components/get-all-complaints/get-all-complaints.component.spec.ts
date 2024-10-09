import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllComplaintsComponent } from './get-all-complaints.component';

describe('GetAllComplaintsComponent', () => {
  let component: GetAllComplaintsComponent;
  let fixture: ComponentFixture<GetAllComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
