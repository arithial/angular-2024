import { TestBed } from '@angular/core/testing';

import { FinishedBooksService } from './finished-books.service';

describe('FinishedBooksService', () => {
  let service: FinishedBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinishedBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
