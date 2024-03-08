import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';
import Home from '../pages/Home';
import Map from '../pages/LocMap';
import Layout from './components/Layout';
// Import the AuthContext
import {AuthContext} from './context/AuthContext';
import {UserContext} from './context/UserContext';
import {ApolloProvider} from '@apollo/client';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import CreateEvent from '../pages/CreateEvent';

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {setUser} = useContext(UserContext);

  useEffect(() => {
    // Load the user data from localStorage when the application starts
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, [setUser]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <Router>
          <div>
            {/* Wrap the JSX elements inside a parent element */}
            <Layout />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/LocMap" element={<Map />} />
              <Route path="/createEvent" element={<CreateEvent />} />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
