import {gql} from '@apollo/client';

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
  mutation UpdateUserSettings($user: UserInput!) {
    updateUser(user: $user) {
      user {
        user_name
        email
      }
    }
  }
`;

export {getUser, userSettings};
