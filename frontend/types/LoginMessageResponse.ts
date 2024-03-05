import {User} from './User';

export type LoginMessageResponse = {
  login: {
    token?: string;
    message: string;
    user: User;
  };
};
