import {Component, OnInit} from '@angular/core';
import {Book, GetMonthlyBookGQL, GetMonthlyBookQuery} from '../../../graphql/generated';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DisplayComponent} from '../display/display.component';

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

  bookData: Book | undefined;
  monthlyBook: Observable<GetMonthlyBookQuery['monthlyBook']> | undefined;
  constructor(private getMonthlyBookGQL: GetMonthlyBookGQL) {}

  ngOnInit() {
    this.monthlyBook = this.getMonthlyBookGQL.fetch().pipe(map(res => res.data.monthlyBook));
    this.monthlyBook.subscribe({
      next: data => {
        if(data != null) {

          this.bookData = data as Book;
          this.bookTitle = this.bookData.title as string;
          this.isbn = this.bookData.isbn as string;
          this.author = this.bookData.author as string;
        }
        else {
          this.bookData = undefined;
          console.log("no data");
        }
        console.log(this.bookData);
      },
      error: err => console.error(err),
      complete: () => console.log('done')
    });
  }

}
