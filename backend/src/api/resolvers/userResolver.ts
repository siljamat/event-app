/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserInput, User} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {UserResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import {isAdmin, isLoggedIn} from '../../functions/authorize';
import {__InputValue} from 'graphql';
import {log} from 'console';
import {ObjectId} from 'mongoose';
import EventModel from '../models/eventModel';

export default {
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
      args: {user: Partial<UserInput>},
      context: MyContext,
    ) => {
      return await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/${context.userdata?.user.id}`,
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
    deleteUser: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
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
    },
    //TODO: fixaa
    toggleFavorite: async (
      _parent: undefined,
      args: {eventId: ObjectId},
      context: MyContext,
    ) => {
      // isLoggedIn(context);
      // const user: User = await fetchData<User>(
      //   `${process.env.AUTH_URL}/auth/user/${context.userdata?.user.id}`,
      // );
      // const isFavorited = user.favorites.some(
      //   (event) => event.id === args.eventId,
      // );
      // if (isFavorited) {
      //   // The event is already in the favorites, so remove it
      //   user.favorites = user.favorites.filter(
      //     (event) => event.id !== args.eventId,
      //   );
      // } else {
      //   // The event is not in the favorites, so add it
      //   const event: Event = await EventModel.findById(args.eventId);
      //   if (!event) {
      //     throw new Error('Event not found');
      //   }
      //   user.favorites.push(event);
      // }
    },
  },
};
