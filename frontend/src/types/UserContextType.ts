import {User} from '../types/User';

// User context type

type UserContextType = {
  user: User | null;
  setUser: (value: User | null) => void;
};

export type {UserContextType};
