import {
  Component,
  inject,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommentFormService} from '../comments/comment-form/comment-form.service';
import {Subscription, take} from 'rxjs';


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
export class BookDetailsComponent implements OnInit, OnChanges, OnDestroy {
  bookDetails: Book | null = null;
  userInfo: User | null = null;
  selectedId: string | null = null;
  page: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  panelOpenState = false;
  comments: Comment[] | null = [];
  totalItems: number = 0;
  readonly dialog = inject(MatDialog);
  subscription: Subscription | null = null;

  private updateComments() {
    if (this.panelOpenState && this.selectedId != null) {
      console.log("comments fetch")
      this.bookService.getCommentsForBook(this.selectedId, this.page, this.pageSize).pipe(take(1)).subscribe({
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


  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.selectedId = params.get('id');
      console.log(this.selectedId);
      if (this.selectedId != null) {
        let bookQuery = this.bookService.getBook(this.selectedId);
        bookQuery.pipe(take(1)).subscribe(
          {
            next: (book) => {
              this.bookDetails = book as Book;
            },
            error: (error) => {
              console.log(error);
            }
          }
        );
        this.userInfo = this.authService.currentUser();
      } else {
        this.router.navigate(['404']);
      }
    });
  }

  refreshComments($event: boolean) {
    this.updateComments();

  }

  updateComment($event: Comment) {
    const dialogRef = this.dialog.open(CommentEditDialog, {
      data: {
        comment: $event
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === true) {
        this.updateComments();
      }
    });
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

export interface DialogData {
  comment: Comment;
}

@Component({
  selector: 'comment-edit-dialog',
  templateUrl: 'comment-edit-dialog.html',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatDialogActions
  ],
  standalone: true
})
export class CommentEditDialog {
  readonly dialogRef = inject(MatDialogRef<CommentEditDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly comment = model(this.data.comment.text);

  constructor(private commentService: CommentFormService,) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  updateComment() {
    console.log("comment update " + this.comment())
    this.commentService.updateComment(this.data.comment.id, this.comment()).pipe(take(1)).subscribe({
      next: (comment) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.log(error);
      }
    })

  }
}
