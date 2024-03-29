/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import randomstring from 'randomstring';
import {UserTest} from '../src/types/DBTypes';
import {Application} from 'express';
import {
  LoginResponse,
  ToggleResponse,
  UserResponse,
} from '../src/types/MessageTypes';

// get user from graphql query users
const getUser = (url: string | Application): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: '{users{id user_name email}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          resolve(response.body.data.users);
        }
      });
  });
};

/* test for graphql query
query UserById($userByIdId: ID!) {
  userById(id: $userByIdId) {
    user_name
    id
    email
  }
}
*/
const getSingleUser = (
  url: string | Application,
  id: string,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query UserById($userByIdId: ID!) {
          userById(id: $userByIdId) {
            user_name
            id
            email
          }
        }`,
        variables: {
          userByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user.id).toBe(id);
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          resolve(response.body.data.userById);
        }
      });
  });
};

/* test for graphql query
mutation Mutation($user: UserInput!) {
  register(user: $user) {
    message
    user {
      id
      user_name
      email
    }
  }
}
*/
const postUser = (
  url: string | Application,
  user: UserTest,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($user: UserInput!) {
          register(user: $user) {
            message
            user {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          user: {
            user_name: user.user_name,
            email: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.register;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(user.user_name);
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.register);
        }
      });
  });
};

/* test for graphql query
mutation Login($credentials: Credentials!) {
  login(credentials: $credentials) {
    message
    token
    user {
      email
      id
      user_name
    }
  }
}
*/

const loginUser = (
  url: string | Application,
  vars: {credentials: {username: string; password: string}},
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Login($credentials: Credentials!) {
          login(credentials: $credentials) {
            token
            message
            user {
              email
              user_name
              id
            }
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = vars.credentials;
          console.log('login response', response.body);
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('token');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.email).toBe(user.username);
          resolve(response.body.data.login);
        }
      });
  });
};

/* test for graphql query
mutation UpdateUser($user: UserModify!) {
  updateUser(user: $user) {
    token
    message
    user {
      id
      user_name
      email
    }
  }
}
*/
const putUser = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    const newValue = 'Test Loser ' + randomstring.generate(7);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($user: UserModify!) {
          updateUser(user: $user) {
            message
            user {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          user: {
            id: '1',
            user_name: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(newValue);
          resolve(response.body.data.updateUser);
        }
      });
  });
};

/* test for graphql query
mutation DeleteUser {
  deleteUser {
    message
    user {
      id
      user_name
      email
    }
  }
}
*/

const deleteUser = (
  url: string | Application,
  token: string,
  userId: string,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser($deleteUserId: ID!) {
          deleteUser(id: $deleteUserId) {
            message
            user {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          deleteUserId: userId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log(response.body);
          const userData = response.body.data.deleteUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          resolve(userData);
        }
      });
  });
};

const adminDeleteUser = (
  url: string | Application,
  id: string,
  token: string,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
          deleteUserAsAdmin(id: $deleteUserAsAdminId) {
            user {
              id
            }
          }
        }`,
        variables: {
          deleteUserAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUserAsAdmin;
          expect(userData.user.id).toBe(id);
          console.log('delete user as admin', userData);
          resolve(userData);
        }
      });
  });
};

const wrongUserDeleteUser = (
  url: string | Application,
  id: string,
  token: string,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
          deleteUserAsAdmin(id: $deleteUserAsAdminId) {
            user {
              id
            }
          }
        }`,
        variables: {
          deleteUserAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUserAsAdmin;
          expect(userData).toBe(null);
          resolve(response.body.data.deleteUser);
        }
      });
  });
};

const toggleFavoriteEvent = (
  url: string | Application,
  token: string,
  eventId: string,
): Promise<ToggleResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation ToggleFavoriteEvent($eventId: ID!) {
          toggleFavoriteEvent(eventId: $eventId) {
            message
            isTrue
          }
        }`,
        variables: {
          eventId: eventId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('toggle response', response.body);
          const eventData = response.body.data.toggleFavoriteEvent;
          expect(eventData).toHaveProperty('isTrue');
          resolve(eventData.isTrue);
        }
      });
  });
};

const toggleAttendingEvent = (
  url: string | Application,
  token: string,
  eventId: string,
): Promise<ToggleResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation ToggleAttendingEvent($eventId: ID!) {
          toggleAttendingEvent(eventId: $eventId) {
            message
            isTrue
          }
        }`,
        variables: {
          eventId: eventId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const eventData = response.body.data.toggleAttendingEvent;
          expect(eventData).toHaveProperty('isTrue');
          resolve(eventData.isTrue);
        }
      });
  });
};

export {
  getUser,
  getSingleUser,
  postUser,
  putUser,
  deleteUser,
  loginUser,
  adminDeleteUser,
  wrongUserDeleteUser,
  toggleFavoriteEvent,
  toggleAttendingEvent,
};
