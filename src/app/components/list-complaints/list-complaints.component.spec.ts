import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComplaintsComponent } from './list-complaints.component';

describe('ListComplaintsComponent', () => {
  let component: ListComplaintsComponent;
  let fixture: ComponentFixture<ListComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
