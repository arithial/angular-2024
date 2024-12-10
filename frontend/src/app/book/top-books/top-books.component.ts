import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Book} from '../../../graphql/generated';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {MatDivider} from '@angular/material/divider';
import {TopBooksService} from './top-books.service';
import {VoteOptionComponent} from '../votes/vote-option/vote-option.component';
import {AuthService} from '../../../services/auth.service';
import {interval, Subscription} from 'rxjs';

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
export class TopBooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  refreshed = signal(false);
  isAuthenticated = false;
  private refreshSub: Subscription | null = null;

  constructor(private topBookService: TopBooksService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.refreshSub = interval(2000).subscribe(() => {
    this.refreshed.set(false);
      this.refresh();
    })
    this.refresh();
  }

  private refresh() {
    const topList = this.topBookService.getTopList();
    topList.subscribe(books => {
        let newBooks = [];
        for (let book of books.books) {
          if (book) {
            newBooks.push(book);
          }
        }
        this.books = newBooks.sort((a, b) => b.totalVotes - a.totalVotes);
        this.refreshed.set(true);
      }
    )
  }


  ngOnDestroy(): void {
    if(this.refreshSub)
    {
      this.refreshSub.unsubscribe();
      this.refreshSub = null;
    }
  }
}
