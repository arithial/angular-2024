import {Injectable} from '@angular/core';
import {
  AddCommentGQL,
  DeleteMutationResponse,
  RemoveCommentGQL,
  UpdateCommentGQL,
  VoteMutationResponse
} from '../../../../graphql/generated';
import {AuthService} from '../../../../services/auth.service';
import {map} from 'rxjs/operators';
import {EMPTY} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentFormService {

  constructor(private createCommentGQL: AddCommentGQL, private updateCommentGQL: UpdateCommentGQL,private deleteCommentGQL: RemoveCommentGQL, private authService: AuthService) {
  }

  addComment(text: string, bookId: string) {
    if (this.authService.isLoggedIn()) {
      var token = this.authService.getToken() as string;
      var addCommentQuery = this.createCommentGQL.mutate({
        text: text,
        bookId: bookId,
        userId:token
      });
      return addCommentQuery.pipe(map(result => result.data?.addComment as VoteMutationResponse | null));
    }
    return EMPTY;
  }

  updateComment(commentId: string, newText: string) {
    if (this.authService.isLoggedIn()) {
      var addCommentQuery = this.updateCommentGQL.mutate({
        commentId:commentId,
        newText:newText
      });
      return addCommentQuery.pipe(map(result => result.data?.updateComment as VoteMutationResponse | null));
    }
    return EMPTY;
  }

  deleteComment(commentId: string) {
    if (this.authService.isLoggedIn()) {
      var deleteCommentQuery = this.deleteCommentGQL.mutate({
        commentId:commentId
      }).pipe(map(result => result.data?.removeComment as DeleteMutationResponse));
      return deleteCommentQuery;
    }
    return EMPTY;
  }
}
