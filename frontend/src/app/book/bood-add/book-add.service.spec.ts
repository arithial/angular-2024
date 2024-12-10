import { TestBed } from '@angular/core/testing';

import { BookAddService } from './book-add.service';

describe('BookAddService', () => {
  let service: BookAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
