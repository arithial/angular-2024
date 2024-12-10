import {gql} from 'apollo-angular'

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      isbn
      title
      author
      rating
      totalVotes
      selected
      description
      read
      userVote {
        approve
      }
    }
  }
`;

// Query to get paginated books
export const GET_PAGINATED_BOOKS = gql`
  query GetPaginatedBooks($limit: Int!, $page: Int!) {
    paginatedBooks(limit: $limit, page: $page) {
      books {
        id
        isbn
        title
        author
        rating
        totalVotes
      }
      startPage
      count
      total
    }
  }
`;

// Query to search books by author
export const SEARCH_BOOKS_BY_AUTHOR = gql`
  query SearchBooksByAuthor($name: String!) {
    searchBooksByAuthor(name: $name) {
      id
      isbn
      title
      author
      rating
    }
  }
`;

// Query to get unfinished books
export const GET_UNFINISHED_BOOKS = gql`
  query GetUnfinishedBooks($limit: Int!, $page: Int!) {
    unfinishedBooks(limit: $limit, page: $page) {
      books {
        id
        index
        isbn
        title
        author
        rating
        totalVotes
      }
      startPage
      count
      total
    }
  }
`;

// Query to get finished books
export const GET_FINISHED_BOOKS = gql`
  query GetFinishedBooks($limit: Int!, $page: Int!) {
    finishedBooks(limit: $limit, page: $page) {
      books {
        id
        isbn
        title
        author
        rating
        totalVotes
      }
      startPage
      count
      total
    }
  }
`;

// Query to get the monthly book selection
export const GET_MONTHLY_BOOK = gql`
  query GetMonthlyBook {
    monthlyBook {
      id
      isbn
      title
      author
      rating
      description
    }
  }
`;

// Mutation to add a new book
export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $description: String!, $isbn: String!) {
    addBook(title: $title, author: $author, description: $description, isbn: $isbn) {
      code
      success
      message
      book {
        id
        title
        author
        description
        isbn
      }
      bookId
    }
  }
`;

// Mutation to remove a book
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      code
      success
      message
    }
  }
`;
