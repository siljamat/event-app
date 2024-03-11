/* eslint-disable @typescript-eslint/no-unused-vars */
import {useContext, useEffect, useState} from 'react';
import {loginMutation, registerMutation} from '../graphql/queries';
import {Credentials} from '../types/Credentials';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import RegisterSuccessModal from './RegisterSuccessModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import {useMutation} from '@apollo/client';

//TODO:  context/keep user logged even when refreshing the page
//TODO: better errors messages?
const NavBar = () => {
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegistermodalOpen] = useState(false);
  const [isRegisterSuccessModalOpen, setRegisterSuccessModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const {setUser} = useContext(UserContext);

  const [registerErrorMessage, setRegisterError] = useState<string | null>(
    null,
  );
  const [register] = useMutation(registerMutation, {
    onError: (error) => {
      setRegisterError(error.message);
    },
  });

  const [loginErrorMessage, setLoginError] = useState<string | null>(null);
  const [login, {data: loginData}] = useMutation(loginMutation, {
    onError: (error) => {
      setLoginError(error.message);
    },
    onCompleted: (data) => {
      setUser(data.login.user);
      console.log('user', data.login.user);
    },
  });

  // Global variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Function to reset all states
  const resetStates = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setLoginError(null);
  };

  //check token and set user if token is valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      console.log('token found');
      setIsAuthenticated(true);
      const userData = JSON.parse(localStorage.getItem('user') as string);
      setUser(userData);
    }
  }, [API_URL, setIsAuthenticated, setUser]);

  //register validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const validateInput = () => {
    if (!emailRegex.test(email)) {
      setRegisterError('Invalid email');
      return false;
    }

    if (!usernameRegex.test(username)) {
      setRegisterError('Username can only contain alphanumeric characters');
      return false;
    }

    if (password.length < 5) {
      setRegisterError('Password must be at least 5 characters long');
      return false;
    }

    return true;
  };

  //Modal handling TODO: make more functional?
  const openLoginModal = () => {
    resetStates();
    closeRegisterSuccessModal();
    closeRegisterModal;
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    resetStates();
    setLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    resetStates();
    setLoginModalOpen(false);
    setRegistermodalOpen(true);
  };

  const closeRegisterModal = () => {
    resetStates();
    setRegistermodalOpen(false);
  };

  const OpenRegisterSuccessModal = () => {
    resetStates();
    setLoginModalOpen(false);
    setRegistermodalOpen(false);
    setRegisterSuccessModalOpen(true);
  };
  const closeRegisterSuccessModal = () => {
    resetStates();
    setRegistermodalOpen(false);
  };

  //Login and register handling
  const handleLogin = async () => {
    setIsLoading(true);
    console.log('Login, email:', email, 'password:', password);
    const credentials: Credentials = {
      username: email,
      password: password,
    };
    try {
      await login({variables: {credentials}});
      if (loginData && loginData.login) {
        //Store user data
        localStorage.setItem('token', loginData.login.token!);
        const userData = {
          email: loginData.login.user.email,
          id: loginData.login.user.id,
          image: loginData.login.user.image,
          user_name: loginData.login.user.user_name,
          favoriteEvents: loginData.login.user.favoriteEvents,
          createdEvents: loginData.login.user.createdEvents,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        closeLoginModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async () => {
    if (!validateInput()) {
      return;
    }
    console.log('Register', username, password, email);
    const userDta = {
      user_name: username,
      password: password,
      email: email,
    };

    try {
      const registerData = await register({variables: {user: userDta}});
      console.log(registerData);
      if (registerData) {
        OpenRegisterSuccessModal();
      }
      setRegisterError('Registering failed');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    console.log('Logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      <div className="navbar bg-accent">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/LocMap">Close to you</a>
              </li>
              <li>
                <a href="/happeningToday">Happening today</a>
              </li>
            </ul>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/LocMap">Close to you</a>
              </li>
              <li>
                <a href="/happeningToday">Happening today</a>
              </li>
            </ul>
          </div>
        </div>
        {isAuthenticated ? (
          <>
            <div className="navbar-end">
              <button className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a className="justify-between">User settings</a>
                  </li>
                  <li>
                    <a className="link" href="/createEvent">
                      Create event
                    </a>
                  </li>
                  <li>
                    <a id="logoutButton" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="navbar-end">
            <a id="loginButton" className="btn" onClick={openLoginModal}>
              Login
            </a>
          </div>
        )}
      </div>
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        closeLoginModal={closeLoginModal}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLogin={handleLogin}
        openRegisterModal={openRegisterModal}
        loginError={loginErrorMessage || null}
        isLoading={isLoading}
      />
      {/* Register Modal */}
      <RegisterModal
        isRegisterModalOpen={isRegisterModalOpen}
        closeRegisterModal={closeRegisterModal}
        email={email}
        username={username}
        password={password}
        setEmail={setEmail}
        setUsername={setUsername}
        setPassword={setPassword}
        handleRegister={handleRegister}
        openLoginModal={openLoginModal}
        error={registerErrorMessage || null}
      />
      <RegisterSuccessModal
        isRegisterSuccessModalOpen={isRegisterSuccessModalOpen}
        closeRegisterSuccessModal={closeRegisterSuccessModal}
        openLoginModal={openLoginModal}
      />
    </>
  );
};

export default NavBar;
