import {gql} from '@apollo/client';

// Queries and mutations
const loginMutation = gql`
  mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      message
      token
      user {
        email
        id
        user_name
      }
    }
  }
`;

const registerMutation = gql`
  mutation Register($user: UserInput!) {
    register(user: $user) {
      user {
        email
        id
        user_name
      }
    }
  }
`;

const checkToken = `
query CheckToken {
    checkToken {
      message
      user {
        user_name
      }
    }
  }
`;

const getCategories = `
query Categories {
    categories {
      category_name
      id
    }
  }
`;

const addCategory = `
mutation CreateCategory($category_name: String!) {
    createCategory(category_name: $category_name) {
      category_name
      id
    }
  }
`;

const updateCategory = `
mutation UpdateCategory($id: String!, $category_name: String!) {
    updateCategory(id: $id, category_name: $category_name) {
      category_name
      id
    }
  }
`;

const deleteCategory = `
mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      message
    }
  }
`;

const likedEvents = gql`
  query FavoritedEventsByUserId($userId: ID!) {
    favoritedEventsByUserId(id: $userId) {
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

const attendingEvents = gql`
  query AttendedEventsByUserId($userId: ID!) {
    attendedEventsByUserId(id: $userId) {
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
  query CreatedEventsByUserId($userId: ID!) {
    createdEventsByUserId(id: $userId) {
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
const toggleFavoriteEvent = gql`
  mutation ToggleFavoriteEvent($eventId: ID!) {
    toggleFavoriteEvent(eventId: $eventId) {
      isTrue
      message
    }
  }
`;
const toggleAttendingEvent = gql`
  mutation ToggleAttendingEvent($eventId: ID!) {
    toggleAttendingEvent(eventId: $eventId) {
      message
      isTrue
    }
  }
`;

export {
  loginMutation,
  registerMutation,
  checkToken,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  likedEvents,
  attendingEvents,
  getUserEvents,
  toggleFavoriteEvent,
  toggleAttendingEvent,
};
