import { gql } from 'apollo-angular'

export const GET_PAGINATED_COMMENTS_BY_BOOK = gql`
  query GetPaginatedCommentsByBook($bookId: ID!, $limit: Int!, $page: Int!) {
    paginatedCommentsByBook(bookId: $bookId, limit: $limit, page: $page) {
      book {
        id
        title
      }
      comments {
        id
        text
        user {
          id
          username
        }
      }
      startPage
      count
      total
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($userId: ID!, $bookId: ID!, $text: String!) {
    addComment(userId: $userId, bookId: $bookId, text: $text) {
      code
      success
      message
      comment {
        id
        text
        user {
          id
          username
        }
        book {
          id
          title
        }
      }
      commentId
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: ID!, $newText: String!) {
    updateComment(commentId: $commentId, newText: $newText) {
      code
      success
      message
      comment {
        id
        text
        user {
          id
          username
        }
        book {
          id
          title
        }
      }
      commentId
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation RemoveComment($commentId: ID!) {
    removeComment(commentId: $commentId) {
      code
      success
      message
    }
  }
`;
