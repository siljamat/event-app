import {useContext, useEffect, useState} from 'react';
import {doGraphQLFetch} from '../graphql/fetch';
import {checkToken, login, register} from '../graphql/queries';
import {Credentials} from '../types/Credentials';
import {LoginMessageResponse} from '../types/LoginMessageResponse';
import {AuthContext} from '../context/AuthContext'; // adjust the path based on where you created AuthContext.tsx
import RegisterModal from './registerModal';
import LoginModal from './LoginModal';
import {UserContext} from '../context/UserContext';
import RegisterSuccessModal from './RegisterSuccessModal';

//TODO:  figure out how to move the login modal and register modal to own components
//and how to pass all data etc
const NavBar = () => {
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegistermodalOpen] = useState(false);
  const [isRegisterSuccessModalOpen, setRegisterSuccessModalOpen] =
    useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const {setUser} = useContext(UserContext);

  // Global variables
  const API_URL = import.meta.env.VITE_API_URL;
  //const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;

  useEffect(() => {
    (async () => {
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
            console.log('token valid');
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [API_URL, setIsAuthenticated]);

  const openLoginModal = () => {
    setRegistermodalOpen(false);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setLoginModalOpen(false);
    setRegistermodalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegistermodalOpen(false);
  };

  const OpenRegisterSuccessModal = () => {
    setLoginModalOpen(false);
    setRegistermodalOpen(false);
    setRegisterSuccessModalOpen(true);
  };
  const closeRegisterSuccessModal = () => {
    setRegistermodalOpen(false);
  };

  const handleLogin = async () => {
    console.log('Login');
    const credentials: Credentials = {
      username: email,
      password: password,
    };
    console.log(credentials);
    try {
      const loginData = (await doGraphQLFetch(API_URL, login, {
        credentials,
      })) as LoginMessageResponse;
      console.log(loginData);
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
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    console.log('Register', username, password, email);
    const userDta = {
      username: username,
      password: password,
      email: email,
    };
    console.log(userDta);
    const registerData = await doGraphQLFetch(API_URL, register, {userDta});
    console.log(registerData);
    OpenRegisterSuccessModal();
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
                    <a>Create event</a>
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
