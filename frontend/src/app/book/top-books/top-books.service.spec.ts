import { TestBed } from '@angular/core/testing';

import { TopBooksService } from './top-books.service';

describe('TopBooksService', () => {
  let service: TopBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
