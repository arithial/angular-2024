import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Custom Scalar for Date management. It serializes dates in String, formatted as: YYYY-MM-DD. */
  Date: { input: any; output: any; }
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isbn: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  read?: Maybe<Scalars['Boolean']['output']>;
  selected?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  totalVotes?: Maybe<Scalars['Int']['output']>;
  userVote?: Maybe<UserVote>;
};

export type BookMutationResponse = MutationResponse & {
  __typename?: 'BookMutationResponse';
  book: Book;
  bookId: Scalars['ID']['output'];
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  book: Book;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  user: User;
};

export type CommentMutationResponse = MutationResponse & {
  __typename?: 'CommentMutationResponse';
  code: Scalars['Int']['output'];
  comment: Comment;
  commentId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteMutationResponse = MutationResponse & {
  __typename?: 'DeleteMutationResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FinaliseVoteMutationResponse = MutationResponse & {
  __typename?: 'FinaliseVoteMutationResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  monthlySelection: Book;
  selectedBookId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBook?: Maybe<BookMutationResponse>;
  addComment?: Maybe<CommentMutationResponse>;
  deleteVoteForUserAndBook?: Maybe<DeleteMutationResponse>;
  finalizeVote?: Maybe<FinaliseVoteMutationResponse>;
  register?: Maybe<UserMutationResponse>;
  removeBook?: Maybe<DeleteMutationResponse>;
  removeComment?: Maybe<DeleteMutationResponse>;
  updateComment?: Maybe<CommentMutationResponse>;
  updateUserAdmin?: Maybe<UserMutationResponse>;
  updateUserEmail?: Maybe<UserMutationResponse>;
  updateUserPassword?: Maybe<UserMutationResponse>;
  voteOnBook?: Maybe<VoteMutationResponse>;
};


export type MutationAddBookArgs = {
  author: Scalars['String']['input'];
  description: Scalars['String']['input'];
  isbn: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationAddCommentArgs = {
  bookId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationDeleteVoteForUserAndBookArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  user?: InputMaybe<UserInput>;
};


export type MutationRemoveBookArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['ID']['input'];
  newText: Scalars['String']['input'];
};


export type MutationUpdateUserAdminArgs = {
  admin: Scalars['Boolean']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateUserEmailArgs = {
  email: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateUserPasswordArgs = {
  password: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationVoteOnBookArgs = {
  approve: Scalars['Boolean']['input'];
  bookId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type MutationResponse = {
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PaginatedBooks = {
  __typename?: 'PaginatedBooks';
  books: Array<Maybe<Book>>;
  count: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  book: Book;
  comments: Array<Maybe<Comment>>;
  count: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  count: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  users: Array<Maybe<User>>;
};

export type PaginatedVotes = {
  __typename?: 'PaginatedVotes';
  count: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  votes: Array<Maybe<Vote>>;
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  books: Array<Maybe<Book>>;
  currentUser?: Maybe<User>;
  finishedBooks?: Maybe<PaginatedBooks>;
  loginToken?: Maybe<LoginResponse>;
  monthlyBook?: Maybe<Book>;
  paginatedBooks?: Maybe<PaginatedBooks>;
  paginatedCommentsByBook?: Maybe<PaginatedComments>;
  paginatedUserVotes?: Maybe<PaginatedVotes>;
  paginatedUsers?: Maybe<PaginatedUsers>;
  searchBooksByAuthor: Array<Maybe<Book>>;
  unfinishedBooks?: Maybe<PaginatedBooks>;
};


export type QueryBookArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFinishedBooksArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryLoginTokenArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type QueryPaginatedBooksArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryPaginatedCommentsByBookArgs = {
  bookId: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryPaginatedUserVotesArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryPaginatedUsersArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QuerySearchBooksByAuthorArgs = {
  name: Scalars['String']['input'];
};


export type QueryUnfinishedBooksArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  username: Scalars['String']['output'];
};

export type UserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UserMutationResponse = MutationResponse & {
  __typename?: 'UserMutationResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type UserVote = {
  __typename?: 'UserVote';
  approve: Scalars['Boolean']['output'];
};

export type Vote = {
  __typename?: 'Vote';
  approve: Scalars['Boolean']['output'];
  book: Book;
  id: Scalars['ID']['output'];
};

export type VoteMutationResponse = MutationResponse & {
  __typename?: 'VoteMutationResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  vote: Vote;
  voteId: Scalars['ID']['output'];
};

export type GetBookQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBookQuery = { __typename?: 'Query', book?: { __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null, totalVotes?: number | null, selected?: boolean | null, description?: string | null, read?: boolean | null, userVote?: { __typename?: 'UserVote', approve: boolean } | null } | null };

export type GetPaginatedBooksQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetPaginatedBooksQuery = { __typename?: 'Query', paginatedBooks?: { __typename?: 'PaginatedBooks', startPage: number, count: number, total: number, books: Array<{ __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null, totalVotes?: number | null } | null> } | null };

export type SearchBooksByAuthorQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchBooksByAuthorQuery = { __typename?: 'Query', searchBooksByAuthor: Array<{ __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null } | null> };

export type GetUnfinishedBooksQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetUnfinishedBooksQuery = { __typename?: 'Query', unfinishedBooks?: { __typename?: 'PaginatedBooks', startPage: number, count: number, total: number, books: Array<{ __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null, totalVotes?: number | null } | null> } | null };

export type GetFinishedBooksQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetFinishedBooksQuery = { __typename?: 'Query', finishedBooks?: { __typename?: 'PaginatedBooks', startPage: number, count: number, total: number, books: Array<{ __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null, totalVotes?: number | null } | null> } | null };

export type GetMonthlyBookQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthlyBookQuery = { __typename?: 'Query', monthlyBook?: { __typename?: 'Book', id: string, isbn: string, title?: string | null, author?: string | null, rating?: number | null, description?: string | null } | null };

export type AddBookMutationVariables = Exact<{
  title: Scalars['String']['input'];
  author: Scalars['String']['input'];
  description: Scalars['String']['input'];
  isbn: Scalars['String']['input'];
}>;


export type AddBookMutation = { __typename?: 'Mutation', addBook?: { __typename?: 'BookMutationResponse', code: number, success: boolean, message: string, bookId: string, book: { __typename?: 'Book', id: string, title?: string | null, author?: string | null, description?: string | null, isbn: string } } | null };

export type RemoveBookMutationVariables = Exact<{
  bookId: Scalars['ID']['input'];
}>;


export type RemoveBookMutation = { __typename?: 'Mutation', removeBook?: { __typename?: 'DeleteMutationResponse', code: number, success: boolean, message: string } | null };

export type GetPaginatedCommentsByBookQueryVariables = Exact<{
  bookId: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetPaginatedCommentsByBookQuery = { __typename?: 'Query', paginatedCommentsByBook?: { __typename?: 'PaginatedComments', startPage: number, count: number, total: number, book: { __typename?: 'Book', id: string, title?: string | null }, comments: Array<{ __typename?: 'Comment', id: string, text: string, user: { __typename?: 'User', id: string, username: string } } | null> } | null };

export type AddCommentMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment?: { __typename?: 'CommentMutationResponse', code: number, success: boolean, message: string, commentId: string, comment: { __typename?: 'Comment', id: string, text: string, user: { __typename?: 'User', id: string, username: string }, book: { __typename?: 'Book', id: string, title?: string | null } } } | null };

export type UpdateCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
  newText: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment?: { __typename?: 'CommentMutationResponse', code: number, success: boolean, message: string, commentId: string, comment: { __typename?: 'Comment', id: string, text: string, user: { __typename?: 'User', id: string, username: string }, book: { __typename?: 'Book', id: string, title?: string | null } } } | null };

export type RemoveCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', removeComment?: { __typename?: 'DeleteMutationResponse', code: number, success: boolean, message: string } | null };

export type GetPaginatedUserVotesQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetPaginatedUserVotesQuery = { __typename?: 'Query', paginatedUserVotes?: { __typename?: 'PaginatedVotes', startPage: number, count: number, total: number, votes: Array<{ __typename?: 'Vote', id: string, approve: boolean, book: { __typename?: 'Book', id: string, title?: string | null, author?: string | null } } | null> } | null };

export type VoteOnBookMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  bookId: Scalars['ID']['input'];
  approve: Scalars['Boolean']['input'];
}>;


export type VoteOnBookMutation = { __typename?: 'Mutation', voteOnBook?: { __typename?: 'VoteMutationResponse', code: number, success: boolean, message: string, voteId: string, vote: { __typename?: 'Vote', id: string, approve: boolean, book: { __typename?: 'Book', id: string, title?: string | null, author?: string | null } } } | null };

export type DeleteVoteForUserAndBookMutationVariables = Exact<{
  bookId: Scalars['ID']['input'];
}>;


export type DeleteVoteForUserAndBookMutation = { __typename?: 'Mutation', deleteVoteForUserAndBook?: { __typename?: 'DeleteMutationResponse', code: number, success: boolean, message: string } | null };

export type FinalizeVoteMutationVariables = Exact<{ [key: string]: never; }>;


export type FinalizeVoteMutation = { __typename?: 'Mutation', finalizeVote?: { __typename?: 'FinaliseVoteMutationResponse', code: number, success: boolean, message: string, selectedBookId: string, monthlySelection: { __typename?: 'Book', id: string, title?: string | null, author?: string | null, rating?: number | null } } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } | null };

export type LoginUserQueryVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserQuery = { __typename?: 'Query', loginToken?: { __typename?: 'LoginResponse', code: number, success: boolean, message: string, token?: string | null } | null };

export type GetPaginatedUsersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetPaginatedUsersQuery = { __typename?: 'Query', paginatedUsers?: { __typename?: 'PaginatedUsers', startPage: number, count: number, total: number, users: Array<{ __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } | null> } | null };

export type RegisterUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register?: { __typename?: 'UserMutationResponse', code: number, success: boolean, message: string, userId: string, user: { __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } } | null };

export type UpdateUserAdminMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  admin: Scalars['Boolean']['input'];
}>;


export type UpdateUserAdminMutation = { __typename?: 'Mutation', updateUserAdmin?: { __typename?: 'UserMutationResponse', code: number, success: boolean, message: string, userId: string, user: { __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } } | null };

export type UpdateUserEmailMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
}>;


export type UpdateUserEmailMutation = { __typename?: 'Mutation', updateUserEmail?: { __typename?: 'UserMutationResponse', code: number, success: boolean, message: string, userId: string, user: { __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } } | null };

export type UpdateUserPasswordMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdateUserPasswordMutation = { __typename?: 'Mutation', updateUserPassword?: { __typename?: 'UserMutationResponse', code: number, success: boolean, message: string, userId: string, user: { __typename?: 'User', id: string, username: string, email: string, isAdmin?: boolean | null } } | null };

export const GetBookDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetBookGQL extends Apollo.Query<GetBookQuery, GetBookQueryVariables> {
    document = GetBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPaginatedBooksDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetPaginatedBooksGQL extends Apollo.Query<GetPaginatedBooksQuery, GetPaginatedBooksQueryVariables> {
    document = GetPaginatedBooksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchBooksByAuthorDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class SearchBooksByAuthorGQL extends Apollo.Query<SearchBooksByAuthorQuery, SearchBooksByAuthorQueryVariables> {
    document = SearchBooksByAuthorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUnfinishedBooksDocument = gql`
    query GetUnfinishedBooks($limit: Int!, $page: Int!) {
  unfinishedBooks(limit: $limit, page: $page) {
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetUnfinishedBooksGQL extends Apollo.Query<GetUnfinishedBooksQuery, GetUnfinishedBooksQueryVariables> {
    document = GetUnfinishedBooksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetFinishedBooksDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetFinishedBooksGQL extends Apollo.Query<GetFinishedBooksQuery, GetFinishedBooksQueryVariables> {
    document = GetFinishedBooksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMonthlyBookDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetMonthlyBookGQL extends Apollo.Query<GetMonthlyBookQuery, GetMonthlyBookQueryVariables> {
    document = GetMonthlyBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddBookDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class AddBookGQL extends Apollo.Mutation<AddBookMutation, AddBookMutationVariables> {
    document = AddBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveBookDocument = gql`
    mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    code
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveBookGQL extends Apollo.Mutation<RemoveBookMutation, RemoveBookMutationVariables> {
    document = RemoveBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPaginatedCommentsByBookDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetPaginatedCommentsByBookGQL extends Apollo.Query<GetPaginatedCommentsByBookQuery, GetPaginatedCommentsByBookQueryVariables> {
    document = GetPaginatedCommentsByBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddCommentDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class AddCommentGQL extends Apollo.Mutation<AddCommentMutation, AddCommentMutationVariables> {
    document = AddCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCommentDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCommentGQL extends Apollo.Mutation<UpdateCommentMutation, UpdateCommentMutationVariables> {
    document = UpdateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveCommentDocument = gql`
    mutation RemoveComment($commentId: ID!) {
  removeComment(commentId: $commentId) {
    code
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveCommentGQL extends Apollo.Mutation<RemoveCommentMutation, RemoveCommentMutationVariables> {
    document = RemoveCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPaginatedUserVotesDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class GetPaginatedUserVotesGQL extends Apollo.Query<GetPaginatedUserVotesQuery, GetPaginatedUserVotesQueryVariables> {
    document = GetPaginatedUserVotesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VoteOnBookDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class VoteOnBookGQL extends Apollo.Mutation<VoteOnBookMutation, VoteOnBookMutationVariables> {
    document = VoteOnBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteVoteForUserAndBookDocument = gql`
    mutation DeleteVoteForUserAndBook($bookId: ID!) {
  deleteVoteForUserAndBook(bookId: $bookId) {
    code
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteVoteForUserAndBookGQL extends Apollo.Mutation<DeleteVoteForUserAndBookMutation, DeleteVoteForUserAndBookMutationVariables> {
    document = DeleteVoteForUserAndBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FinalizeVoteDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class FinalizeVoteGQL extends Apollo.Mutation<FinalizeVoteMutation, FinalizeVoteMutationVariables> {
    document = FinalizeVoteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    id
    username
    email
    isAdmin
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCurrentUserGQL extends Apollo.Query<GetCurrentUserQuery, GetCurrentUserQueryVariables> {
    document = GetCurrentUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginUserDocument = gql`
    query LoginUser($username: String!, $password: String!) {
  loginToken(username: $username, password: $password) {
    code
    success
    message
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginUserGQL extends Apollo.Query<LoginUserQuery, LoginUserQueryVariables> {
    document = LoginUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPaginatedUsersDocument = gql`
    query GetPaginatedUsers($limit: Int!, $page: Int!) {
  paginatedUsers(limit: $limit, page: $page) {
    users {
      id
      username
      email
      isAdmin
    }
    startPage
    count
    total
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPaginatedUsersGQL extends Apollo.Query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables> {
    document = GetPaginatedUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterUserDocument = gql`
    mutation RegisterUser($user: UserInput!) {
  register(user: $user) {
    code
    success
    message
    user {
      id
      username
      email
      isAdmin
    }
    userId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    document = RegisterUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserAdminDocument = gql`
    mutation UpdateUserAdmin($userId: ID!, $admin: Boolean!) {
  updateUserAdmin(userId: $userId, admin: $admin) {
    code
    success
    message
    user {
      id
      username
      email
      isAdmin
    }
    userId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserAdminGQL extends Apollo.Mutation<UpdateUserAdminMutation, UpdateUserAdminMutationVariables> {
    document = UpdateUserAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserEmailDocument = gql`
    mutation UpdateUserEmail($userId: ID!, $email: String!) {
  updateUserEmail(userId: $userId, email: $email) {
    code
    success
    message
    user {
      id
      username
      email
      isAdmin
    }
    userId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserEmailGQL extends Apollo.Mutation<UpdateUserEmailMutation, UpdateUserEmailMutationVariables> {
    document = UpdateUserEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserPasswordDocument = gql`
    mutation UpdateUserPassword($userId: ID!, $password: String!) {
  updateUserPassword(userId: $userId, password: $password) {
    code
    success
    message
    user {
      id
      username
      email
      isAdmin
    }
    userId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserPasswordGQL extends Apollo.Mutation<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables> {
    document = UpdateUserPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }