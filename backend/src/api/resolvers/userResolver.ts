/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserInput, User, Event} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {UserResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import {isLoggedIn} from '../../functions/authorize';
import {__InputValue} from 'graphql';
import {log} from 'console';
import {ObjectId} from 'mongoose';
import EventModel from '../models/eventModel';

export default {
  Event: {
    creator: async (parent: Event) => {
      return await fetchData<User>(
        `${process.env.AUTH_URL}/users/${parent.creator}`,
      );
    },
  },
  Query: {
    users: async () => {
      return await fetchData<User[]>(`${process.env.AUTH_URL}/users`);
    },
    userById: async (_parent: undefined, args: {id: string}) => {
      return await fetchData<User>(`${process.env.AUTH_URL}/users/${args.id}`);
    },
    checkToken: async (_parent: undefined, context: MyContext) => {
      return await {user: context.userdata?.user};
    },
    // TO-DO
    createdEvents: async (_parent: undefined, context: MyContext) => {},
    // TO-DO:
    favoritedEvents: async (_parent: undefined, context: MyContext) => {},
    // TO-DO
    attendedEvents: async (_parent: undefined, context: MyContext) => {},
  },
  Mutation: {
    login: async (
      _parent: undefined,
      args: {credentials: {username: string; password: string}},
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
      if (
        context.userdata?.user.id === args.user.id ||
        context.userdata?.user.role === 'admin'
      ) {
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
      }
      throw new Error('Not authorized');
    },
    deleteUser: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      if (
        context.userdata?.user.id === args.id ||
        context.userdata?.user.role === 'admin'
      ) {
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
      }
      throw new Error('Not authorized');
    },
    toggleFavoriteEvent: async (
      _parent: undefined,
      args: {eventId: ObjectId},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      try {
        // Päivitetään tapahtuman favoritedBy-kenttä tietokantaan
        const event = await EventModel.findById(args.eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        const userId = context.userdata?.user.id;
        const isFavorited = event.favoritedBy.includes(userId);

        // Jos käyttäjä on jo tykännyt tapahtumasta, se poistetaan event-objektista
        if (isFavorited) {
          event.favoritedBy = event.favoritedBy.filter(
            (favoritedUserId) => favoritedUserId.toString() !== userId,
          );
          console.log('Event unfavorited by', userId);
        } else {
          event.favoritedBy.push(userId);
          console.log('Event favorited by', userId);
        }

        // Päivitetään tapahtuman favoriteCount-kenttä tietokantaan
        event.favoriteCount = event.favoritedBy.length;
        // Tallennetaan muutokset
        await event.save();

        // Päivitetään käyttäjän favoritedEvents-kenttä tietokantaan
        const updatedUser = await fetchData<UserResponse>(
          `${process.env.AUTH_URL}/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
            body: JSON.stringify({
              favoritedEvents: isFavorited
                ? // Jos käyttäjä on jo tykännyt tapahtumasta, se poistetaan käyttäjä-objektista
                  (context.userdata?.user.favoritedEvents || []).filter(
                    (eventId) => eventId.toString() !== args.eventId.toString(),
                  )
                : // Jos käyttäjä ei ole vielä tykännyt tapahtumasta, se lisätään käyttäjä-objektiin
                  [
                    ...(context.userdata?.user.favoritedEvents || []),
                    args.eventId,
                  ],
            }),
          },
        );
        return event;
      } catch (error) {
        throw new Error('Failed to toggle favorite event.');
      }
    },
    // TO-DO: toggleAttendingEvent
  },
};
