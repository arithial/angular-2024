import { Injectable } from '@angular/core';
import {DeleteVoteForUserAndBookGQL, VoteMutationResponse, VoteOnBookGQL} from '../../../graphql/generated';
import {AuthService} from '../../../services/auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private voteGQL: VoteOnBookGQL,
              private clearVoteQuery: DeleteVoteForUserAndBookGQL,
              private auth: AuthService) { }

  vote(bookId: string, approved: boolean) {
      const token = this.auth.getToken() as string;

      return this.voteGQL.mutate({
        bookId: bookId,
        approve: approved,
        userId:token
      }).pipe(map(result => result.data?.voteOnBook as VoteMutationResponse));
  }

  clearVote(bookId: string) {

    return this.clearVoteQuery.mutate({
      bookId: bookId
    }).pipe(map(result=> result.data));
  }
}
