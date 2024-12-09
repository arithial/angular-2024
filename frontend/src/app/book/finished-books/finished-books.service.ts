import { Injectable } from '@angular/core';
import {GetFinishedBooksGQL, PaginatedBooks} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinishedBooksService {

  constructor(private getFinishedBooksGQL: GetFinishedBooksGQL) { }

  getFinishedBooks(limit: number, page: number) {
    const topList = this.getFinishedBooksGQL.fetch({
      limit: limit,
      page: page
    }).pipe(map(result => result.data.finishedBooks));
    return firstValueFrom(topList) as Promise<PaginatedBooks>;
  }
}
