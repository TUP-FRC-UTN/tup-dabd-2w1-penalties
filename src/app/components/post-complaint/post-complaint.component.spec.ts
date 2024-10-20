import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComplaintComponent } from './post-complaint.component';

describe('PostComplaintComponent', () => {
  let component: PostComplaintComponent;
  let fixture: ComponentFixture<PostComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
