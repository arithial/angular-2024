import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Book,
  GetBookGQL,
  GetPaginatedCommentsByBookGQL,
  PaginatedComments
} from '../../../graphql/generated';
import {map} from 'rxjs/operators';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookDetailsService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private getBookGQL: GetBookGQL,
              private getComments: GetPaginatedCommentsByBookGQL) {
  }

  getBook(id: string) {
    var bookQuery = this.getBookGQL.fetch({
      id: id,
    }).pipe(map(result => {
      console.log(result.data);
      return result.data?.book;
    }));
    return firstValueFrom(bookQuery as Observable<Book>);
  }

  getCommentsForBook(bookId: string, page: number, limit: number) : Promise<PaginatedComments> {
    var commentsQuery = this.getComments.fetch({
      bookId:bookId,
      page:page,
      limit:limit
    }).pipe(map(result => {return result.data}));
    return firstValueFrom(commentsQuery as Observable<PaginatedComments>);
  }
}
