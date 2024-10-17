import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesSanctionsReportListComponent } from './penalties-sanctions-report-list.component';

describe('PenaltiesSanctionsReportListComponent', () => {
  let component: PenaltiesSanctionsReportListComponent;
  let fixture: ComponentFixture<PenaltiesSanctionsReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltiesSanctionsReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesSanctionsReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
