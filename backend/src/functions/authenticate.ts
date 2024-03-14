import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {LoginUser, TokenContent} from '../types/DBTypes';
import {MyContext} from '../types/MyContext';

/**
 * Function for authenticating the user.
 */
export default async (req: Request): Promise<MyContext> => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const userFromToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as LoginUser;
      if (!userFromToken) {
        return {};
      }
      // add token to user object so we can use it in resolvers
      const tokenContent: TokenContent = {
        token: token,
        user: userFromToken,
      };

      return {userdata: tokenContent};
    } catch (error) {
      return {};
    }
  }
  return {};
};
