import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserVote} from '../../../../graphql/generated';
import {VoteService} from '../vote.service';
import {AuthService} from '../../../../services/auth.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {BookDetailsService} from '../../book-details/book-details.service';

@Component({
  selector: 'app-vote-option',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './vote-option.component.html',
  standalone: true,
  styleUrl: './vote-option.component.scss'
})
export class VoteOptionComponent implements OnInit, OnChanges {
  userVote: UserVote | null = null;
  @Input('bookId') bookId: string = '';
  authenticated: boolean = false;

  constructor(private voteService: VoteService, private authService: AuthService, private bookDetailService: BookDetailsService) {
  }

  ngOnInit() {
    this.authenticated = this.authService.isLoggedIn();
  }

  vote(approved: boolean) {
    var sub = this.voteService.vote(this.bookId, approved).subscribe({
      next: (voteMutation) => {
        this.userVote = {
          __typename: "UserVote",
          approve: voteMutation.vote.approve
        }
      },
      error: (error) => {
      },
      complete: () => {
        sub.unsubscribe();
      }
    })
  }

  clearVote() {
    var sub = this.voteService.clearVote(this.bookId).subscribe({
      next: (voteMutation) => {
        this.userVote = null;
      },
      error: (error) => {
      },
      complete: () => {
        sub.unsubscribe();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.bookDetailService.getBook(this.bookId).then((book) => this.userVote = book.userVote as UserVote | null);
  }

}
