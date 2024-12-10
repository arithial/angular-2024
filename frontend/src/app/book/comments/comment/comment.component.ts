import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {Comment} from '../../../../graphql/generated';
import {AuthService, authSignal} from '../../../../services/auth.service';
import {CommentFormService} from '../comment-form/comment-form.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-comment',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardTitleGroup,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './comment.component.html',
  standalone: true,
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() updatePressed = new EventEmitter<Comment>();
  @Output() deletedPressed = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private commentService: CommentFormService) {
  }

  protected readonly authSignal = authSignal;

  isOwnerOrAdmin() {
    return this.authService.isLoggedIn() && (this.authService.currentUser()?.id === this.comment.user.id || this.authService.currentUser()?.isAdmin);
  }

  update()
  {
    this.updatePressed.emit(this.comment);
  }

  delete()
  {
    var sub = this.commentService.deleteComment(this.comment.id).subscribe({
      next: (data) => {
        this.deletedPressed.emit(true);
      }
    })
  }
}
