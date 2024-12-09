import { Injectable } from '@angular/core';
import {GetUnfinishedBooksGQL, PaginatedBooks} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBooksService {

  constructor(private getUnfinishedBooksGQL: GetUnfinishedBooksGQL) { }

  getTopList() {
    const topList = this.getUnfinishedBooksGQL.fetch({
      limit: 5,
      page: 0
    }).pipe(map(result => result.data.unfinishedBooks));
    return firstValueFrom(topList) as Promise<PaginatedBooks>;
  }
}
