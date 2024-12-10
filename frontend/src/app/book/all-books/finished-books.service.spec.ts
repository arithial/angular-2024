import { TestBed } from '@angular/core/testing';

import { AllBooksService } from './all-books.service';

describe('FinishedBooksService', () => {
  let service: AllBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
