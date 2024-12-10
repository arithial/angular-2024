import { Injectable } from '@angular/core';
import {FinalizeVoteGQL, FinalizeVoteMutation} from '../../graphql/generated';
import {map} from 'rxjs/operators';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontService {

  constructor(private finaliseVoteGQL: FinalizeVoteGQL) { }


  finaliseVote() {
    let vote = this.finaliseVoteGQL.mutate().pipe(map(result => result.data?.finalizeVote));

    return vote.pipe(take(1));
  }
}
