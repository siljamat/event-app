import React from 'react';
import {Transition} from '@headlessui/react';

interface LoginModalProps {
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  openRegisterModal: () => void;
  loginError: string | null;
  isLoading: boolean;
}

// LoginModal component displays a modal for logging in
const LoginModal: React.FC<LoginModalProps> = ({
  isLoginModalOpen,
  closeLoginModal,
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  openRegisterModal,
  loginError,
  isLoading,
}) => {
  return (
    <Transition show={isLoginModalOpen} as="div">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div
            id="login_modal"
            className="absolute top-0 right-0 flex items-center justify-center bg-gray-900 bg-opacity-50 w-full h-full"
          >
            {/* Modal content */}
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              {/*Error message*/}
              {loginError && (
                <div role="alert" className="alert alert-error mt-5 mb-5">
                  <span>Login failed, check your input</span>
                </div>
              )}
              <button
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
                onClick={closeLoginModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <button
                  onClick={handleLogin}
                  className={`btn btn-primary px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  Login
                </button>
                <a className="link" onClick={openRegisterModal}>
                  No account? Sign up here.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default LoginModal;
