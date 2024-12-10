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

  getCommentsForBook(bookId: string, page: number, limit: number) : Observable<PaginatedComments> {
    var commentsQuery = this.getComments.watch({
      bookId:bookId,
      page:page,
      limit:limit
    },{
      fetchPolicy: "no-cache"
    }).valueChanges.pipe(map(result => {return result.data.paginatedCommentsByBook}));
    return commentsQuery as Observable<PaginatedComments>;
  }
}
