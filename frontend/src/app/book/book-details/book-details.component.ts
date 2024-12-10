import {Component, effect, OnChanges, OnInit, Signal, signal, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment, Book, User} from '../../../graphql/generated';
import {ArtworkComponent} from '../../cover/artwork/artwork.component';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {BookDetailsService} from './book-details.service';
import {AuthService} from '../../../services/auth.service';
import {VoteOptionComponent} from '../votes/vote-option/vote-option.component';
import {CommentComponent} from '../comments/comment/comment.component';
import {CommentFormComponent} from '../comments/comment-form/comment-form.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-book-details',
  imports: [
    ArtworkComponent,
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    VoteOptionComponent,
    CommentComponent,
    CommentFormComponent,
    MatPaginator
  ],
  templateUrl: './book-details.component.html',
  standalone: true,
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit, OnChanges {
  bookDetails: Book | null = null;
  userInfo: User | null = null;
  selectedId: string | null = null;
  page: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  panelOpenState = false;
  comments: Comment[] | null = [];
  totalItems: number = 0;

  private updateComments() {
    if (this.panelOpenState && this.selectedId != null) {
      console.log("comments fetch")
      var sub = this.bookService.getCommentsForBook(this.selectedId, this.page, this.pageSize).subscribe({
        next: (page) => {
          console.log("comments fetch parsing")
          this.totalPages = Math.ceil(page.total / this.pageSize);
          this.totalItems = page.total;
          this.comments = [];
          console.log(page);
          console.log(this.comments.length);
          page.comments.forEach(comment => {
            if (comment && this.comments) {
              this.comments.push(comment);
            }
          })
          this.comments.sort((c1, c2) => {
            return c1.index - c2.index;
          });
          console.log(this.comments);
        }
      });

    } else {
      this.comments = [];
    }
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BookDetailsService,
              private authService: AuthService) {
  }

  random() {
    var length = 10;
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var result = '';

    for (var i = 0; i < length; i++) {

      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));

    }

    return result;


  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedId = params.get('id');
      console.log(this.selectedId);
    });
    if (this.selectedId != null) {
      var bookQuery = this.bookService.getBook(this.selectedId);
      bookQuery.then(
        (book) => {
          this.bookDetails = book as Book;
        })
      this.userInfo = this.authService.currentUser();
    } else {
      this.router.navigate(['404']);
    }
  }

  refreshComments($event: boolean) {
    this.updateComments();

  }

  updateComment($event: Comment) {
    // dialog
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateComments();
  }

  handlePageEvent($event: PageEvent) {
    this.page = $event.pageIndex;
    this.updateComments();

  }

  panelOpen(b: boolean) {
    this.panelOpenState = b;
    this.updateComments();
  }
}
