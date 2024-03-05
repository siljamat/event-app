import {Point} from 'geojson';
import {User} from './User';
import {Category} from './Category';

type Event = {
  address: string;
  age_restriction: string;
  category: Category;
  created_at: string;
  creator: User;
  date: string;
  description: string;
  email: string;
  event_name: string;
  event_site: string;
  favoriteCount: number;
  id: string;
  image: string;
  location: {
    coordinates: Point;
    type: string;
  };
  organizer: string;
  price: string;
  ticket_site: string;
};

export type {Event};
