import {Component, OnInit} from '@angular/core';
import {Book} from '../../../graphql/generated';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {RouterLink} from '@angular/router';
import {PercentPipe} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {BooksService} from './books.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {VoteOptionComponent} from '../votes/vote-option/vote-option.component';
import {AuthService} from '../../../services/auth.service';

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
    MatListItemTitle,
    MatPaginator,
    VoteOptionComponent
  ],
  templateUrl: './books.component.html',
  standalone: true,
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  pages: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  currentPage: number = 0;
  isAuthenticated = false;

  constructor(private bookService: BooksService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.updateList();
  }

  updateList(): void {
    const topList = this.bookService.getUnfinishedBooks(this.pageSize, this.currentPage);
    topList.then(books => {
        this.totalItems = books.total;
        this.pages = Math.ceil(books.total / this.pageSize);
        this.books = [];
        for (var book of books.books) {
          if (book) {
            this.books.push(book);
          }
        }
      }
    )
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.updateList();
  }
}
