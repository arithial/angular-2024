import { Injectable } from '@angular/core';
import {GetFinishedBooksGQL, GetPaginatedBooksGQL, PaginatedBooks} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';
import {AllBooksComponent} from './all-books.component';

@Injectable({
  providedIn: 'root'
})
export class AllBooksService {

  constructor(private getFinishedBooksGQL: GetPaginatedBooksGQL) { }

  getFinishedBooks(limit: number, page: number) {
    const topList = this.getFinishedBooksGQL.fetch({
      limit: limit,
      page: page
    }).pipe(map(result => result.data.paginatedBooks));
    return firstValueFrom(topList) as Promise<PaginatedBooks>;
  }
}
