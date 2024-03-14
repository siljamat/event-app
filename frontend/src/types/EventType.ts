import {User} from './User';

// Event type

type EventType = {
  address: string;
  age_restriction: string;
  category: string[];
  created_at: string;
  creator: User;
  date: string;
  description: string;
  email: string;
  event_name: string;
  event_site: string;
  favoriteCount: number;
  attendeeCount: number;
  id: string;
  image: string;
  location: {
    coordinates: [number, number];
    type: string;
  };
  organizer: string;
  price: string;
  ticket_site: string;
};

export type {EventType};
