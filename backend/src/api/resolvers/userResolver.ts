/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserInput, User, Event} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {ToggleResponse, UserResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import {isAdmin, isLoggedIn} from '../../functions/authorize';
import {__InputValue} from 'graphql';
import mongoose, {Types} from 'mongoose';
import EventModel from '../models/eventModel';

/**
 * GraphQL resolvers.
 * @type {import('graphql').IResolvers}
 */
export default {
  /**
   * Resolves the creator field for Event type.
   * @param {Event} parent - Parent resolver object
   * @returns {Promise<User>} - Resolved user object
   */
  Event: {
    creator: async (parent: Event) => {
      return await fetchData<User>(
        `${process.env.AUTH_URL}/users/${parent.creator}`,
      );
    },
  },
  Query: {
    /**
     * Resolves the users query.
     * @returns {Promise<User[]>} - Resolved user array
     */
    users: async () => {
      return await fetchData<User[]>(`${process.env.AUTH_URL}/users`);
    },
    /**
     * Resolves the userById query.
     * @param {undefined} _parent - Parent resolver object
     * @param {{id: string}} args - Resolver arguments
     * @returns {Promise<User>} - Resolved user object
     */
    userById: async (_parent: undefined, args: {id: string}) => {
      return await fetchData<User>(`${process.env.AUTH_URL}/users/${args.id}`);
    },
    checkToken: async (_parent: undefined, context: MyContext) => {
      return await {user: context.userdata?.user};
    },
    createdEventsByUserId: async (_parent: undefined, args: {id: string}) => {
      console.log('args:', args);
      const response = await fetchData<User>(
        `${process.env.AUTH_URL}/users/${args.id}`,
      );
      if (!response) {
        throw new Error(`No user found with id ${args.id}`);
      }
      const eventIds = response.createdEvents;
      if (!eventIds) {
        throw new Error(`No created events found for user with id ${args.id}`);
      }
      // Get all events created by the user
      const createdEvents = await Promise.all(
        eventIds.map(async (id: Types.ObjectId) => {
          const event = await EventModel.findById(id);
          if (!event) {
            throw new Error(`No event found with eventId ${id}`);
          }
          return event;
        }),
      );
      console.log('createdEvents:', createdEvents);
      return createdEvents;
    },
    favoritedEventsByUserId: async (_parent: undefined, args: {id: string}) => {
      const response = await fetchData<User>(
        `${process.env.AUTH_URL}/users/${args.id}`,
      );
      if (!response) {
        throw new Error(`No user found with id ${args.id}`);
      }
      const eventIds = response.favoritedEvents;
      if (!eventIds) {
        throw new Error(
          `No favorited events found for user with id ${args.id}`,
        );
      }
      // Get all favorited events by the user
      const favoritedEvents = await Promise.all(
        eventIds.map(async (id: Types.ObjectId) => {
          const event = await EventModel.findById(id);
          if (!event) {
            throw new Error(`No event found with eventId ${id}`);
          }
          return event;
        }),
      );
      console.log('favoritedEvents:', favoritedEvents);
      return favoritedEvents;
    },
    attendedEventsByUserId: async (_parent: undefined, args: {id: string}) => {
      const response = await fetchData<User>(
        `${process.env.AUTH_URL}/users/${args.id}`,
      );
      if (!response) {
        throw new Error(`No user found with id ${args.id}`);
      }
      const eventIds = response.attendedEvents;
      if (!eventIds) {
        throw new Error(
          `No favorited events found for user with id ${args.id}`,
        );
      }
      // Get all attended events by the user
      const attendedEvents = await Promise.all(
        eventIds.map(async (id: Types.ObjectId) => {
          const event = await EventModel.findById(id);
          if (!event) {
            throw new Error(`No event found with eventId ${id}`);
          }
          return event;
        }),
      );
      return attendedEvents;
    },
  },
  /**
   * Resolves the login mutation.
   * @param {undefined} _parent - Parent resolver object
   * @param {{credentials: {email: string; password: string}}} args - Resolver arguments
   * @returns {Promise<UserResponse>} - Resolved user response
   */
  Mutation: {
    /**
     * Login mutation
     * @param _parent
     * @param args
     * @returns {Promise<UserResponse>}
     */
    login: async (
      _parent: undefined,
      args: {credentials: {email: string; password: string}},
    ) => {
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(args.credentials),
        },
      );
    },
    /**
     * Register mutation
     * @param _parent
     * @param args
     * @returns {Promise<UserResponse>}
     */
    register: async (_parent: undefined, args: {user: UserInput}) => {
      return await fetchData<UserResponse>(`${process.env.AUTH_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      });
    },
    updateUser: async (
      _parent: undefined,
      args: {user: User},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      const {id, role, ...input} = args.user;
      console.log('user Input for update user:', input);
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/${args.user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.userdata?.token}`,
          },
          body: JSON.stringify(input),
        },
      );
    },
    deleteUser: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      try {
        // Get all events that the user has favorited or attended
        const userId = new mongoose.Types.ObjectId(args.id);
        const eventsToUpdate = await EventModel.find({
          $or: [{favoritedBy: userId}, {attendedBy: userId}],
        });
        // Go through all events and remove the user id
        await Promise.all(
          eventsToUpdate.map(async (event) => {
            const favorited = event.favoritedBy.includes(userId);
            const attended = event.attendedBy.includes(userId);
            event.favoritedBy = event.favoritedBy.filter(
              (favoritedUserId) => favoritedUserId.toString() !== args.id,
            );
            event.attendedBy = event.attendedBy.filter(
              (attendedUserId) => attendedUserId.toString() !== args.id,
            );
            if (favorited) {
              event.favoriteCount -= 1;
            }
            if (attended) {
              event.attendeeCount -= 1;
            }
            await event.save();
          }),
        );
        // Remove all events created by the user
        const events = await EventModel.find({creator: userId});
        await Promise.all(
          events.map(async (event) => {
            await EventModel.deleteOne({_id: event._id});
          }),
        );
        // Remove the user
        return await fetchData<UserResponse>(
          `${process.env.AUTH_URL}/users/${args.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
          },
        );
      } catch (error) {
        throw new Error('Failed to delete user and update event fields.');
      }
    },
    updateUserAsAdmin: async (
      _parent: undefined,
      args: {user: Partial<UserInput>},
      context: MyContext,
    ) => {
      isAdmin(context);
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/${context.userdata?.user}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.userdata?.token}`,
          },
          body: JSON.stringify(args.user),
        },
      );
    },
    deleteUserAsAdmin: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isAdmin(context);
      try {
        // Get all events that the user has favorited or attended
        const userId = new mongoose.Types.ObjectId(args.id);
        const eventsToUpdate = await EventModel.find({
          $or: [{favoritedBy: userId}, {attendedBy: userId}],
        });
        await Promise.all(
          eventsToUpdate.map(async (event) => {
            const favorited = event.favoritedBy.includes(userId);
            const attended = event.attendedBy.includes(userId);
            event.favoritedBy = event.favoritedBy.filter(
              (favoritedUserId) => favoritedUserId.toString() !== args.id,
            );
            event.attendedBy = event.attendedBy.filter(
              (attendedUserId) => attendedUserId.toString() !== args.id,
            );
            if (favorited) {
              event.favoriteCount -= 1;
            }
            if (attended) {
              event.attendeeCount -= 1;
            }
            await event.save();
          }),
        );
        // Remove all events created by the user
        const events = await EventModel.find({creator: userId});
        await Promise.all(
          events.map(async (event) => {
            await EventModel.deleteOne({_id: event._id});
          }),
        );
        // Remove the user
        return await fetchData<UserResponse>(
          `${process.env.AUTH_URL}/users/${args.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
          },
        );
      } catch (error) {
        throw new Error('Failed to delete user and update event fields.');
      }
    },
    toggleFavoriteEvent: async (
      _parent: undefined,
      args: {eventId: String},
      context: MyContext,
    ): Promise<ToggleResponse> => {
      isLoggedIn(context);
      try {
        // Update the event's favoritedBy field in the database
        const event = await EventModel.findById(args.eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        console.log('event', event);
        const userId = context.userdata?.user.id.toString();
        const isFavorited = event.favoritedBy.includes(userId);
        let isFavorite = isFavorited;
        // If the user has already favorited the event, remove the user id from the event object
        if (isFavorited) {
          event.favoritedBy = event.favoritedBy.filter(
            (favoritedUserId) =>
              favoritedUserId && favoritedUserId.toString() !== userId,
          );
          isFavorite = false;
          console.log('Event unfavorited by', userId);
        } else {
          event.favoritedBy.push(userId);
          isFavorite = true;
          console.log('Event favorited by', userId);
        }
        // Update the event's favoriteCount field in the database
        event.favoriteCount = event.favoritedBy.length;
        await event.save();
        // Update the user's favoritedEvents field in the database
        await fetchData<UserResponse>(
          `${process.env.AUTH_URL}/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
            body: JSON.stringify({
              favoritedEvents: isFavorited
                ? // If the user has already favorited the event, remove the event id from the user object
                  (context.userdata?.user.favoritedEvents || []).filter(
                    (eventId) => eventId.toString() !== args.eventId.toString(),
                  )
                : // If the user has not yet favorited the event, add the event id to the user object
                  [
                    ...(context.userdata?.user.favoritedEvents || []),
                    args.eventId,
                  ],
            }),
          },
        );
        return {
          message: 'Successfully toggled favorite status',
          isTrue: isFavorite,
        };
      } catch (error) {
        throw new Error('Failed to toggle favorite event.');
      }
    },
    toggleAttendingEvent: async (
      _parent: undefined,
      args: {eventId: String},
      context: MyContext,
    ): Promise<ToggleResponse> => {
      isLoggedIn(context);
      try {
        // Update the event's attendedBy field in the database
        const event = await EventModel.findById(args.eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        const userId = context.userdata?.user.id;
        const isAttending = event.attendedBy.includes(userId);
        let isAttendingEvent = isAttending;

        // If the user has already attended the event, remove the user id from the event object
        if (isAttending) {
          event.attendedBy = event.attendedBy.filter(
            (attendedUserId) =>
              attendedUserId && attendedUserId.toString() !== userId,
          );
          isAttendingEvent = false;
          console.log('Event unattended by', userId);
        } else {
          event.attendedBy.push(userId);
          isAttendingEvent = true;
          console.log('Event attended by', userId);
        }

        // Update the event's attendeeCount field in the database
        event.attendeeCount = event.attendedBy.length;
        await event.save();

        // Update the user's attendedEvents field in the database
        await fetchData<UserResponse>(
          `${process.env.AUTH_URL}/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
            body: JSON.stringify({
              attendedEvents: isAttending
                ? // If the user has already attended the event, remove the event id from the user object
                  (context.userdata?.user.attendedEvents || []).filter(
                    (eventId) => eventId.toString() !== args.eventId.toString(),
                  )
                : // If the user has not yet attended the event, add the event id to the user object
                  [
                    ...(context.userdata?.user.attendedEvents || []),
                    args.eventId,
                  ],
            }),
          },
        );
        return {
          message: 'Successfully toggled attending status',
          isTrue: isAttendingEvent,
        };
      } catch (error) {
        throw new Error('Failed to toggle attending event.');
      }
    },
  },
};
