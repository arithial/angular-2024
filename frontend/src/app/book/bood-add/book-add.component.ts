import {Component, inject} from '@angular/core';
import {BookAddService} from './book-add.service';
import {take} from 'rxjs';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-bood-add',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatButton,
    MatIconButton,
    FormsModule,
    MatSuffix
  ],
  templateUrl: './book-add.component.html',
  standalone: true,
  styleUrl: './book-add.component.scss'
})
export class BookAddComponent {
  title = '';
  author = '';
  isbn = '';
  description = '';
  private _snackBar = inject(MatSnackBar);
  private form: FormGroup;

  openSnackBar(message: string) {
    this._snackBar.open(message, "Ok", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  constructor(private bookAddService: BookAddService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', [Validators.required]],
      isbn: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(14)]],
      description: ['']
    });
  }

  submitForm() {
    const bookDetails = {
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      description: this.description
    };
    this.bookAddService.addBook(bookDetails).subscribe({
      next: (book) => {
        if (book) {
          if (book.success) {
            console.log('Book added successfully', book);
            let s = 'book/' + book.bookId;
            this.form.reset();
            this.router.navigate([s]);
          } else {
            this.handleError("Book Failed to add: " + book.message + "")
          }
        } else {
          this.handleError("Book Failed to add")
        }
      },
      error: (err) => {
        this.handleError("Book Failed to add")
      }
    })
    console.log('Form submitted', bookDetails);
  }


  loadBookData() {
    let isbn = this.isbn;
    console.log('load book data ' + isbn);
    if (isbn && isbn.length > 8 && isbn.length < 15) {
      console.log('isbn valid');
      this.bookAddService.getBookDetails(isbn).pipe(take(1)).subscribe({
        next: (bookDetails) => {
          console.log(bookDetails);
          if (bookDetails) {
            this.author = bookDetails.author;
            this.title = bookDetails.title;
            this.description = bookDetails.description;
          } else {
            this.handleError('Book not found');
          }
        },
        error: (err) => {
          this.handleError('Error loading books from external service.');
        }
      });
    } else {
      console.log('isbn invalid');
    }
  }

  private handleError(bookNotFound: string) {
    console.error(bookNotFound);
    this.openSnackBar(bookNotFound);
  }
}
