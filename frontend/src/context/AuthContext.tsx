import React, {useState} from 'react';
import {AuthContextType} from '../types/AuthContextType';

/**
 * @type {React.Context<AuthContextType>} AuthContext - The context for the authentication state.
 */
export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

/**
 * AuthProvider component provides the authentication state to its children.
 * @param {object} props - The props for the AuthProvider component.
 * @param {React.ReactNode} props.children - The children components to be rendered.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  /**
   * @type {React.State<boolean>} isAuthenticated - The state variable that determines whether the user is authenticated.
   * @function setIsAuthenticated - The function to update the isAuthenticated state.
   */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true',
  );

  /**
   * Function to set the authentication state and store it in local storage.
   * @param {boolean} value - The new authentication state.
   */
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
