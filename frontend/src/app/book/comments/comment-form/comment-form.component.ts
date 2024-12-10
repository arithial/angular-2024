import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {CommentFormService} from './comment-form.service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatButton
  ],
  templateUrl: './comment-form.component.html',
  standalone: true,
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent implements OnInit {
  update: boolean = false;
  @Input('comment') comment: Comment | null = null;
  @Input('bookId') bookId!: string;
  text: string = '';
  @Output('submitted') submitted = new EventEmitter<boolean>(false);

  constructor(private authService: AuthService, private commentService: CommentFormService) {
  }

  ngOnInit() {
    if(this.comment)
    {
      this.update = true;
      this.text = this.comment.textContent as string;
    }
  }

  onSubmit() {
    var sub = this.commentService.addComment(this.text, this.bookId).subscribe({
      next: (data) => {
        this.submitted.emit(true);
      },
      complete: () => {
        sub.unsubscribe();
      }
    });
  }
}
