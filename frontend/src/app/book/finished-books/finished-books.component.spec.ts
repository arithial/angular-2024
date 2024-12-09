import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedBooksComponent } from './finished-books.component';

describe('FinishedBooksComponent', () => {
  let component: FinishedBooksComponent;
  let fixture: ComponentFixture<FinishedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
