import React from 'react';
import {UserContextType} from '../types/UserContextType';

export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
