import {GraphQLError} from 'graphql';
import {MyContext} from '../types/MyContext';

const isLoggedIn = (context: MyContext): void => {
  if (!context.userdata) {
    throw new GraphQLError('Not authenticated', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }
};

const isAdmin = (context: MyContext): void => {
  isLoggedIn(context);
  if (context.userdata && context.userdata.user.role !== 'admin') {
    throw new GraphQLError('Not authorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }
};

export {isLoggedIn, isAdmin};
