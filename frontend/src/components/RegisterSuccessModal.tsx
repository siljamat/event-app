import React from 'react';
import {Transition} from '@headlessui/react';

/**
 * @typedef {object} RegisterSuccessModalProps
 * @property {boolean} isRegisterSuccessModalOpen - Whether the register success modal is open.
 * @property {function} closeRegisterSuccessModal - The function to close the register success modal.
 * @property {function} openLoginModal - The function to open the login modal.
 */

interface RegisterSuccessModalProps {
  isRegisterSuccessModalOpen: boolean;
  closeRegisterSuccessModal: () => void;
  openLoginModal: () => void;
}

/**
 * RegisterSuccessModal component displays a modal for successful registration.
 * @param {RegisterSuccessModalProps} props - The props for the RegisterSuccessModal component.
 * @returns {JSX.Element} The rendered RegisterSuccessModal component.
 */
const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isRegisterSuccessModalOpen,
  closeRegisterSuccessModal,
  openLoginModal,
}) => {
  return (
    <Transition show={isRegisterSuccessModalOpen} as="div">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div
            id="register_success_modal"
            className="absolute top-0 right-0 flex items-center justify-center bg-gray-900 bg-opacity-50 w-full h-full"
          >
            {/* Modal content */}
            <div className="bg-white p-8 rounded-lg shadow-lg relative">
              <button
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
                onClick={closeRegisterSuccessModal}
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
              <h2 className="text-2xl font-bold mb-4">
                Registration Successful
              </h2>

              <div className="flex flex-col">
                <button
                  onClick={openLoginModal}
                  className="btn btn-primary px-4 py-2 rounded"
                >
                  To Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default RegisterSuccessModal;
