import {gql} from 'apollo-angular'

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      username
      email
      isAdmin
    }
  }
`;

export const LOGIN_USER = gql`
  query LoginUser($username: String!, $password: String!) {
    loginToken(username: $username, password: $password) {
      code
      success
      message
      token
    }
  }
`;

export const GET_PAGINATED_USERS = gql`
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

export const REGISTER_USER = gql`
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

export const UPDATE_USER_ADMIN = gql`
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

export const UPDATE_USER_EMAIL = gql`
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

export const UPDATE_USER_PASSWORD = gql`
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

