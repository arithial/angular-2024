import {Component, effect, OnInit, signal} from '@angular/core';
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
    VoteOptionComponent
  ],
  templateUrl: './book-details.component.html',
  standalone: true,
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  bookDetails: Book | null = null;
  userInfo: User | null = null;
  selectedId: string | null = null;
  page: number = 0;
  totalPages: number = 0
  pageSize: number = 10;
  readonly panelOpenState = signal(false);
  comments: Comment[] | null = [];
  effect = effect(() => {
    if (this.panelOpenState() && this.selectedId != null) {
      this.bookService.getCommentsForBook(this.selectedId, this.page, this.pageSize).then(page => {
        this.totalPages = Math.ceil(page.total / this.pageSize);
        this.comments = [];
        if (page.comments && page.comments.length > 0) {
          this.comments.push(...page.comments.map(comment => comment as Comment));
        }
      })

    } else {
      this.comments = [];
    }
  })

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BookDetailsService,
              private authService: AuthService) {
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
    }
    else
    {
      this.router.navigate(['404']);
    }
  }

}
