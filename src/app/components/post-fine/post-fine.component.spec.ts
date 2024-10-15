import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFineComponent } from './post-fine.component';

describe('PostFineComponent', () => {
  let component: PostFineComponent;
  let fixture: ComponentFixture<PostFineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
