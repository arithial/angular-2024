import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteOptionComponent } from './vote-option.component';

describe('VoteOptionComponent', () => {
  let component: VoteOptionComponent;
  let fixture: ComponentFixture<VoteOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
