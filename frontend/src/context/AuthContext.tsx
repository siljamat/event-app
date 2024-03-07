import React from 'react';
import {AuthContextType} from '../types/AuthContextType';

// Create a context with default values
export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});
