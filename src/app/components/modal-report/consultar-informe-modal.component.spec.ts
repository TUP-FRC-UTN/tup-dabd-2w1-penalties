import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarInformeModalComponent } from './consultar-informe-modal.component';

describe('ConsultarInformeModalComponent', () => {
  let component: ConsultarInformeModalComponent;
  let fixture: ComponentFixture<ConsultarInformeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarInformeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarInformeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
