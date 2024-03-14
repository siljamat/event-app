import {gql} from '@apollo/client';

// Queries and mutations for user

const getUser = gql`
  query GetUser($id: ID!) {
    userById(id: $id) {
      id
      user_name
      email
    }
  }
`;

const userSettings = gql`
  mutation updateUser($user: UserModify!) {
    updateUser(user: $user) {
      message
      user {
        id
        user_name
        email
      }
    }
  }
`;

export {getUser, userSettings};
