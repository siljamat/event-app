import {Point} from 'geojson';
import {UserOutput} from './DBTypes';

/**
 * Response type for messages.
 * @property {string} message - The message.
 * @typedef {Object} MessageResponse
 * @property {string} message - The message.
 * @typedef {Object} ErrorResponse
 * @property {string} message - The message.
 * @property {string} stack - The stack trace.
 * @typedef {Object} UserResponse
 * @property {string} message - The message.
 * @property {UserOutput} user - The user.
 * @typedef {Object} LoginResponse
 * @property {string} message - The message.
 * @property {string} token - The token.
 * @property {UserOutput} user - The user.
 * @typedef {Object} UploadResponse
 * @property {string} message - The message.
 * @property {object} data - The data.
 * @property {string} data.filename - The filename.
 * @property {Point} data.location - The location.
 * @typedef {Object} ToggleResponse
 * @property {string} message - The message.
 * @property {boolean} isTrue - The boolean value.
 * @typedef {Object} deleteEventResponse
 * @property {string} message - The message.
 * @property {boolean} success - The success value.
 * @export
 */

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UserResponse = MessageResponse & {
  user: UserOutput;
};

type LoginResponse = MessageResponse & {
  token: string;
  user: UserOutput;
};

type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    location: Point;
  };
};

type ToggleResponse = MessageResponse & {
  isTrue: boolean;
};

type deleteEventResponse = MessageResponse & {
  success: boolean;
};

export {
  MessageResponse,
  ErrorResponse,
  UserResponse,
  LoginResponse,
  UploadResponse,
  ToggleResponse,
  deleteEventResponse,
};
