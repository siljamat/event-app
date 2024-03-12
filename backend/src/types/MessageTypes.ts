import {Point} from 'geojson';
import {UserOutput} from './DBTypes';

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

export {
  MessageResponse,
  ErrorResponse,
  UserResponse,
  LoginResponse,
  UploadResponse,
  ToggleResponse,
};
