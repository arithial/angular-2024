import {Component, OnInit} from '@angular/core';
import {Book, GetUnfinishedBooksQuery, GetUnfinishedBooksGQL} from '../../../graphql/generated';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-top-books',
  imports: [
    MatListItem,
    MatList,
    RouterLink,
    ArtworkComponent,
    MatDivider,
    MatListItemTitle,
    MatListItemLine
  ],
  templateUrl: './top-books.component.html',
  standalone: true,
  styleUrl: './top-books.component.scss'
})
export class TopBooksComponent implements OnInit {
  books: [Book] | undefined;
  topList: Observable<GetUnfinishedBooksQuery['unfinishedBooks']> | undefined;

  constructor(private getUnfinishedBooksGQL: GetUnfinishedBooksGQL) {
  }

  ngOnInit(): void {
    this.topList = this.getUnfinishedBooksGQL.watch({
      limit: 5,
      page: 0
    }).valueChanges.pipe(map(result => result.data.unfinishedBooks));
    this.topList.subscribe({
      next: (books) => {
        this.books = books?.books as [Book];
        for (const book of this.books) {
          console.log(book);
        }
      },
      error: err => console.error(err),
      complete: () => console.log('done')
    });
  }
}
