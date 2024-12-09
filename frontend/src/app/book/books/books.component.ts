import {Component, OnInit} from '@angular/core';
import {Book, GetPaginatedBooksGQL, GetPaginatedBooksQuery} from '../../../graphql/generated';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {RouterLink} from '@angular/router';
import {PercentPipe} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-books',
  imports: [
    MatList,
    MatListItem,
    ArtworkComponent,
    RouterLink,
    PercentPipe,
    MatDivider,
    MatListItemLine,
    MatListItemTitle
  ],
  templateUrl: './books.component.html',
  standalone: true,
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
    books: [Book] | undefined;
    pagedList: Observable<GetPaginatedBooksQuery['paginatedBooks']> | undefined;
    constructor(private getPaginatedBooksGQL : GetPaginatedBooksGQL) { }

  ngOnInit(): void {
      this.pagedList = this.getPaginatedBooksGQL.watch({
        limit: 10,
        page: 0
      }).valueChanges.pipe(map(result=>result.data?.paginatedBooks));
      this.pagedList.subscribe({
        next: (data) => {
          this.books = data?.books as [Book];
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        }
      });
  }
}
