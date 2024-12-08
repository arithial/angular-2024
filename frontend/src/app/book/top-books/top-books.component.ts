import {Component, OnInit} from '@angular/core';
import {Book} from '../../../graphql/generated';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {MatDivider} from '@angular/material/divider';
import {TopBooksService} from './top-books.service';
import {VoteOptionComponent} from '../votes/vote-option/vote-option.component';

@Component({
  selector: 'app-top-books',
  imports: [
    MatListItem,
    MatList,
    RouterLink,
    ArtworkComponent,
    MatDivider,
    MatListItemTitle,
    MatListItemLine,
    VoteOptionComponent
  ],
  templateUrl: './top-books.component.html',
  standalone: true,
  styleUrl: './top-books.component.scss'
})
export class TopBooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private topBookService: TopBooksService) {
  }

  ngOnInit(): void {
    const topList = this.topBookService.getTopList();
    topList.then(books => {
        this.books = [];
        for (var book of books.books) {
          if (book) {

            this.books.push(book);
          }
        }
      }
    )
  }
}
