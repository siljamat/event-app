import {Document, Types} from 'mongoose';
import {Point} from 'geojson';

/**
 * User type definition.
 * @property {Types.ObjectId | string} id - The ID of the user.
 * @property {string} user_name - The username of the user.
 * @property {string} email - The email of the user.
 * @property {'user' | 'admin'} role - The role of the user.
 * @property {string} password - The password of the user.
 * @property {Types.ObjectId[]} createdEvents - The events created by the user.
 * @property {Types.ObjectId[]} favoritedEvents - The events favorited by the user.
 * @property {Types.ObjectId[]} attendedEvents - The events attended by the user.
 */
type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  createdEvents: Types.ObjectId[];
  favoritedEvents: Types.ObjectId[];
  attendedEvents: Types.ObjectId[];
};

type Event = Partial<Document> & {
  id: Types.ObjectId | string;
  created_at: Date;
  event_name: string;
  description: string;
  date: Date;
  location: Point;
  email: string;
  organizer: string;
  address: string;
  age_restriction: string;
  event_site: string;
  ticket_site: string;
  price: string;
  image: string;
  category: Types.ObjectId[];
  creator: Types.ObjectId | User;
  favoriteCount: number;
  favoritedBy: Types.ObjectId[];
  attendeeCount: number;
  attendedBy: Types.ObjectId[];
};

type Category = {
  id: Types.ObjectId | string;
  category_name: string;
};

type FetchDataResponse<T> = {
  ok: boolean;
  data: T;
  statusText: string;
  status: number;
};

type UserOutput = Omit<User, 'password' | 'role'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password'>;

type EventTest = Partial<Event>;

type CategoryTest = Partial<Category>;

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
  EventTest,
  CategoryTest,
  TokenContent,
  Location,
  LocationInput,
  Event,
  Category,
  FetchDataResponse,
};
