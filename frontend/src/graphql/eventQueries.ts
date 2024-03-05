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

const getEventById = `
query Event($id: String!) {
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

const getEventsByCategory = `
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

const getEventsByOrganizer = `
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

const getEventsByMinAge = `
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
const addEvent = `
mutation CreateEvent($event: EventInput!) {
    createEvent(event: $event) {
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

const updateEvent = `
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

const deleteEvent = `
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
  getEventsByOrganizer,
  getEventsByMinAge,
  addEvent,
  updateEvent,
  deleteEvent,
};
