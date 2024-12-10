import {Component, OnInit} from '@angular/core';
import {Book} from '../../../graphql/generated';
import {AllBooksService} from './all-books.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {DisplayComponent} from '../../cover/display/display.component';
import {MatCard, MatCardSubtitle, MatCardTitleGroup} from '@angular/material/card';

@Component({
  selector: 'app-finished-books',
  imports: [
    MatPaginator,
    MatGridList,
    MatGridTile,
    MatCardSubtitle,
    DisplayComponent,
    MatCard,
    MatCardTitleGroup
  ],
  templateUrl: './all-books.component.html',
  standalone: true,
  styleUrl: './all-books.component.scss'
})
export class AllBooksComponent implements OnInit {
  books: Book[] = [];
  pages: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  currentPage: number = 0;

  constructor(private bookService: AllBooksService) {
  }

  ngOnInit(): void {
    this.updateList();
  }

  updateList(): void {
    const topList = this.bookService.getFinishedBooks(this.pageSize, this.currentPage);
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
