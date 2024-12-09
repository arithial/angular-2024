import { Injectable } from '@angular/core';
import {GetUnfinishedBooksGQL, PaginatedBooks,} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private getUnfinishedBooksGQL : GetUnfinishedBooksGQL) { }

  getUnfinishedBooks(limit: number, page: number) {
    const topList = this.getUnfinishedBooksGQL.fetch({
      limit: limit,
      page: page
    }).pipe(map(result => result.data.unfinishedBooks));
    return firstValueFrom(topList) as Promise<PaginatedBooks>;
  }
}
