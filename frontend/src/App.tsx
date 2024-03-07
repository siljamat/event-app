import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';
import Home from '../pages/Home';
import Map from '../pages/LocMap';
import Layout from './components/Layout';

// Import the AuthContext
import {AuthContext} from './context/AuthContext';
import {doGraphQLFetch} from './graphql/fetch';
import {checkToken} from './graphql/queries';
import {UserContext} from './context/UserContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check the token when the component mounts
  useEffect(() => {
    async function checkTokenValidity() {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      if (token !== null) {
        try {
          const isTokenValid = await doGraphQLFetch(
            API_URL,
            checkToken,
            {},
            token,
          );
          if (isTokenValid.checkToken?.message === 'Token is valid') {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    checkTokenValidity();
  }, []);

  const {setUser} = useContext(UserContext);

  useEffect(() => {
    // Load the user data from localStorage when the application starts
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <Router>
        <div>
          {/* Wrap the JSX elements inside a parent element */}
          <Layout />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/LocMap" element={<Map />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
