import { Routes } from '@angular/router';
import {FrontComponent} from './front/front.component';
import {BooksComponent} from './book/books/books.component';
import {BookDetailsComponent} from './book/book-details/book-details.component';
import {LoginComponent} from './user/login/login.component';
import {LogoutComponent} from './user/logout/logout.component';
import {RegisterComponent} from './user/register/register.component';
import {GuestOnlyGuard, LoggedInGuard} from './guards.guard';
import {NotFoundComponent} from './not-found/not-found.component';
import {FinishedBooksComponent} from './book/finished-books/finished-books.component';
import {BookAddComponent} from './book/bood-add/book-add.component';
import {AllBooksComponent} from './book/all-books/all-books.component';

export const routes: Routes = [
  {path: '', component: FrontComponent},
  {path: 'books', component: BooksComponent},
  {path: 'book/new', component: BookAddComponent, canActivate: [LoggedInGuard]},
  {path: 'all', component: AllBooksComponent},
  {path: 'book/:id', component: BookDetailsComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [GuestOnlyGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [LoggedInGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestOnlyGuard]},
  {path: 'finished', component: FinishedBooksComponent},
  {path: '**',  pathMatch: 'full', component: NotFoundComponent},
  {path: '404', component: NotFoundComponent}
];
