import {gql} from 'apollo-angular'

export const GET_PAGINATED_USER_VOTES = gql`
  query GetPaginatedUserVotes($limit: Int!, $page: Int!) {
    paginatedUserVotes(limit: $limit, page: $page) {
      votes {
        id
        approve
        book {
          id
          title
          author
        }
      }
      startPage
      count
      total
    }
  }
`;

export const VOTE_ON_BOOK = gql`
  mutation VoteOnBook($userId: ID!, $bookId: ID!, $approve: Boolean!) {
    voteOnBook(userId: $userId, bookId: $bookId, approve: $approve) {
      code
      success
      message
      vote {
        id
        approve
        book {
          id
          title
          author
        }
      }
      voteId
    }
  }
`;

export const DELETE_VOTE_ON_BOOK = gql`
  mutation DeleteVoteForUserAndBook($bookId: ID!) {
    deleteVoteForUserAndBook(bookId: $bookId) {
      code
      success
      message
    }
  }
`;



export const FINALIZE_VOTE = gql`
  mutation FinalizeVote {
    finalizeVote {
      code
      success
      message
      selectedBookId
      monthlySelection {
        id
        title
        author
        rating
      }
    }
  }
`;
