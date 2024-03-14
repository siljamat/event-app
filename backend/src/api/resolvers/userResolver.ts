/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserInput, User, Event} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {ToggleResponse, UserResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import {isAdmin, isLoggedIn} from '../../functions/authorize';
import {__InputValue} from 'graphql';
import mongoose, {Types, ObjectId} from 'mongoose';
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
      // Haetaan kaikki luodut tapahtumat, joiden id:t löytyivät käyttäjän createdEvents-kentästä
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
      // Haetaan kaikki tykätyt tapahtumat, joiden id:t löytyivät käyttäjän favoritedEvents-kentästä
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
      // Haetaan kaikki osallistutut tapahtumat, joiden id:t löytyivät käyttäjän attendedEvents-kentästä
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
  Mutation: {
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
        // Haetaan kaikki tapahtumat, jotka löytyvät käyttäjän favoritedBy- tai attendedBy-kentistä
        const userId = new mongoose.Types.ObjectId(args.id);
        const eventsToUpdate = await EventModel.find({
          $or: [{favoritedBy: userId}, {attendedBy: userId}],
        });
        // Käydään läpi kaikki tapahtumat ja poistetaan käyttäjän id
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
        // Poistetaan kaikki käyttäjän luomat tapahtumat
        const events = await EventModel.find({creator: userId});
        await Promise.all(
          events.map(async (event) => {
            await EventModel.deleteOne({_id: event._id});
          }),
        );
        // Poistetaan käyttäjä
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
        // Haetaan kaikki tapahtumat, jotka löytyvät käyttäjän favoritedBy- tai attendedBy-kentistä
        const userId = new mongoose.Types.ObjectId(args.id);
        const eventsToUpdate = await EventModel.find({
          $or: [{favoritedBy: userId}, {attendedBy: userId}],
        });
        // Käydään läpi kaikki tapahtumat ja poistetaan käyttäjän id
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
        // Poistetaan kaikki käyttäjän luomat tapahtumat
        const events = await EventModel.find({creator: userId});
        await Promise.all(
          events.map(async (event) => {
            await EventModel.deleteOne({_id: event._id});
          }),
        );
        // Poistetaan käyttäjä
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
        // Päivitetään tapahtuman favoritedBy-kenttä tietokantaan
        const event = await EventModel.findById(args.eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        console.log('event', event);
        const userId = context.userdata?.user.id.toString();
        const isFavorited = event.favoritedBy.includes(userId);
        let isFavorite = isFavorited;
        // Jos käyttäjä on jo tykännyt tapahtumasta, se poistetaan event-objektista
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
        // Päivitetään tapahtuman favoriteCount-kenttä tietokantaan
        event.favoriteCount = event.favoritedBy.length;
        // Tallennetaan muutokset
        await event.save();
        // Päivitetään käyttäjän favoritedEvents-kenttä tietokantaan
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
        // Päivitetään tapahtuman attendedBy-kenttä tietokantaan
        const event = await EventModel.findById(args.eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        const userId = context.userdata?.user.id;
        const isAttending = event.attendedBy.includes(userId);
        let isAttendingEvent = isAttending;

        // Jos käyttäjä on jo ilmoittautunut tapahtumaan, se poistetaan event-objektista
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

        // Päivitetään tapahtuman attendeeCount-kenttä tietokantaan
        event.attendeeCount = event.attendedBy.length;
        // Tallennetaan muutokset
        await event.save();

        // Päivitetään käyttäjän attendedEvents-kenttä tietokantaan
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
                ? // Jos käyttäjä on jo ilmoittautunut tapahtumaan, se poistetaan käyttäjä-objektista
                  (context.userdata?.user.attendedEvents || []).filter(
                    (eventId) => eventId.toString() !== args.eventId.toString(),
                  )
                : // Jos käyttäjä ei ole vielä ilmoittautunut tapahtumaan, se lisätään käyttäjä-objektiin
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
