import {User} from './User';

// Login message response type
export type LoginMessageResponse = {
  login: {
    token?: string;
    message: string;
    user: User;
  };
};
