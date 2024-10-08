import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStateButtonComponent } from './change-state-button.component';

describe('ChangeStateButtonComponent', () => {
  let component: ChangeStateButtonComponent;
  let fixture: ComponentFixture<ChangeStateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStateButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
