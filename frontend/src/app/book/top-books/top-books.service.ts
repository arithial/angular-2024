import { Injectable } from '@angular/core';
import {GetUnfinishedBooksGQL, PaginatedBooks} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBooksService {

  constructor(private getUnfinishedBooksGQL: GetUnfinishedBooksGQL) { }

  getTopList() {
    const topList = this.getUnfinishedBooksGQL.fetch({
      limit: 5,
      page: 0
    }, {
      fetchPolicy: "no-cache"
    }).pipe(map(result => result.data.unfinishedBooks));
    return topList as Observable<PaginatedBooks>;
  }
}
