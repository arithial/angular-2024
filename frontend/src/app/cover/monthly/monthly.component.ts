import {Component, OnInit} from '@angular/core';
import {Book, GetMonthlyBookGQL, GetMonthlyBookQuery} from '../../../graphql/generated';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DisplayComponent} from '../display/display.component';
import {MonthlyService} from './monthly.service';

@Component({
  selector: 'app-monthly',
  imports: [
    DisplayComponent
  ],
  templateUrl: './monthly.component.html',
  standalone: true,
  styleUrl: './monthly.component.scss'
})
export class MonthlyComponent implements OnInit {
  isbn: string | undefined;
  bookTitle: string | undefined;
  author: string | undefined;

  bookData: Book | null = null;
  constructor(private monthlyService: MonthlyService) {}

  ngOnInit() {
    this.monthlyService.getMonthlyBook().then(book => {
      this.bookData = book;
      this.bookTitle = this.bookData.title as string;
      this.isbn = this.bookData.isbn as string;
      this.author = this.bookData.author as string;
    })
  }

}
