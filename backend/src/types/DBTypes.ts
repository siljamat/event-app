import {Document, Types} from 'mongoose';
import {Point} from 'geojson';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  favoritedEvents: Types.ObjectId[];
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
  category: Types.ObjectId;
  creator: Types.ObjectId | User;
  favoriteCount: number;
  favoritedBy: Types.ObjectId[];
};

type Category = {
  id: Types.ObjectId | string;
  category_name: string;
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
  Event,
  Category,
};
