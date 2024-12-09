import { Routes } from '@angular/router';
import {FrontComponent} from './front/front.component';
import {BooksComponent} from './book/books/books.component';
import {BookDetailsComponent} from './book/book-details/book-details.component';
import {LoginComponent} from './user/login/login.component';
import {LogoutComponent} from './user/logout/logout.component';
import {RegisterComponent} from './user/register/register.component';
import {GuestOnlyGuard, LoggedInGuard} from './guards.guard';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {path: '', component: FrontComponent},
  {path: 'books', component: BooksComponent},
  {path: 'book/:id', component: BookDetailsComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [GuestOnlyGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [LoggedInGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestOnlyGuard]},
  {path: '**',  pathMatch: 'full', component: NotFoundComponent},
  {path: '404', component: NotFoundComponent}
];
