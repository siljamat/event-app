import React from 'react';
import {UserContextType} from '../types/UserContextType';

// Create a context for the user state
export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
