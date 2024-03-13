import {gql} from '@apollo/client';

const getAllEvents = `
  query Events {
    events {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventById = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      attendeeCount
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventsByCategory = gql`
  query EventsByCategory($category: String!) {
    eventsByCategory(category: $category) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventsByOrganizer = gql`
  query EventsByOrganizer($organizer: String!) {
    eventsByOrganizer(organizer: $organizer) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventsByMinAge = gql`
  query EventsByMinAge($age: String!) {
    eventsByMinAge(age: $age) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventsByDate = gql`
  query EventsByDate($date: String!) {
    eventsByDate(date: $date) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getEventsByPrice = gql`
  query EventsByPrice($price: String!) {
    eventsByPrice(price: $price) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const getUserEvents = gql`
  query createdEventsByUserId($id: String!) {
    createdEventsByUserId(id: $id) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const addEvent = gql`
  mutation CreateEvent($input: InputEvent!) {
    createEvent(input: $input) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const updateEvent = gql`
  mutation UpdateEvent($id: String!, $event: EventInput!) {
    updateEvent(id: $id, event: $event) {
      address
      age_restriction
      category {
        category_name
      }
      created_at
      creator {
        user_name
      }
      date
      description
      email
      event_name
      event_site
      favoriteCount
      id
      image
      location {
        coordinates
        type
      }
      organizer
      price
      ticket_site
    }
  }
`;

const deleteEvent = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id) {
      message
    }
  }
`;

export {
  getAllEvents,
  getEventById,
  getEventsByCategory,
  getEventsByDate,
  getEventsByPrice,
  getEventsByOrganizer,
  getEventsByMinAge,
  addEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
};
