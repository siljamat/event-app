import {User} from '../types/User';

type UserContextType = {
  user: User | null;
  setUser: (value: User | null) => void;
};

export type {UserContextType};
