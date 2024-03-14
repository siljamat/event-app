// Type definition for User

type User = {
  email: string;
  id: string;
  user_name: string;
  favoriteEvents: Event[];
  createdEvents: Event[];
};

export type {User};
