import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useState, useEffect, useContext} from 'react';
import Home from '../pages/Home';
import Map from '../pages/LocMap';
import {AuthContext} from './context/AuthContext';
import {UserContext} from './context/UserContext';
import {ApolloProvider, createHttpLink} from '@apollo/client';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import CreateEvent from '../pages/CreateEvent';
import EventPage from '../pages/EventPage';
import Layout from './components/Layout';
import UserPage from '../pages/UserPage';
import SearchPage from '../pages/SearchPage';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
  headers: {
    authorization: localStorage.getItem('token')
      ? `Bearer ${localStorage.getItem('token')}`
      : '',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true',
  );

  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, [setUser]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <UserContext.Provider value={{user, setUser}}>
          <Router>
            <div>
              <Layout />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/LocMap" element={<Map />} />
                <Route path="/createEvent" element={<CreateEvent />} />
                <Route path="/userPage" element={<UserPage />} />
                <Route path="/event/:id" element={<EventPage />} />
                <Route path="/searchPage" element={<SearchPage />} />
              </Routes>
            </div>
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
export default App;
