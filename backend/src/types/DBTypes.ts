import {Document, Types} from 'mongoose';
import {Point} from 'geojson';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
};

type UserOutput = Omit<User, 'password' | 'role'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};

// *** db location query
type Location = {
  lat: number;
  lng: number;
};

type LocationInput = {
  topRight: Location;
  bottomLeft: Location;
};
// ***

export {
  User,
  UserOutput,
  UserInput,
  UserTest,
  LoginUser,
  TokenContent,
  Location,
  LocationInput,
};
