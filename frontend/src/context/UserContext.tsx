import React from 'react';
import {UserContextType} from '../types/UserContextType';

/**
 * @type {React.Context<UserContextType>} UserContext - The context for the user state.
 */
export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
