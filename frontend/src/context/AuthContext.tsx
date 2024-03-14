import React, {useState} from 'react';
import {AuthContextType} from '../types/AuthContextType';

// Create a context for the authentication state
export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true',
  );

  const setAuth = (value: boolean) => {
    localStorage.setItem('isAuthenticated', String(value));
    setIsAuthenticated(value);
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, setIsAuthenticated: setAuth}}
    >
      {children}
    </AuthContext.Provider>
  );
};
