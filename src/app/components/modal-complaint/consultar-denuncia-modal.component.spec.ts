import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDenunciaModalComponent } from './consultar-denuncia-modal.component';

describe('ConsultarDenunciaModalComponent', () => {
  let component: ConsultarDenunciaModalComponent;
  let fixture: ComponentFixture<ConsultarDenunciaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarDenunciaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarDenunciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
