// eslint-disable-next-line @typescript-eslint/no-unused-vars
import e from 'express';
import EventModel from '../models/eventModel';
import {isLoggedIn} from '../../functions/authorize';
import {MyContext} from '../../types/MyContext';
import {LocationInput} from '../../types/DBTypes';

export default {
  Query: {
    events: async () => {
      return await EventModel.find();
    },
    eventsFromExternalAPI: async () => {
      const response = await fetch('https://api.hel.fi/linkedevents/v1/event/');
      const data = await response.json();
      return data;
    },
    event: async (_parent: undefined, args: {id: string}) => {
      return await EventModel.findById(args.id);
    },
    eventsByCategory: async (_parent: undefined, args: {category: string}) => {
      return await EventModel.find({category: args.category});
    },
    eventsByDate: async (_parent: undefined, args: {date: Date}) => {
      return await EventModel.find({date: args.date});
    },
    eventsByPrice: async (_parent: undefined, args: {price: string}) => {
      return await EventModel.find({price: args.price});
    },
    eventsByOrganizer: async (
      _parent: undefined,
      args: {organizer: string},
    ) => {
      return await EventModel.find({organizer: args.organizer});
    },
    eventsByMinAge: async (_parent: undefined, args: {age: string}) => {
      return await EventModel.find({age_restriction: args.age});
    },
  },
  Mutation: {
    createEvent: async (
      _parent: undefined,
      args: {input: Omit<Event, 'id'>},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      return await EventModel.create(args.input);
    },
    updateEvent: async (
      _parent: undefined,
      args: {id: string; input: Partial<Omit<Event, 'id'>>},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      return await EventModel.findByIdAndUpdate(args.id, args.input, {
        new: true,
      });
    },
    deleteEvent: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      return await EventModel.findByIdAndDelete(args.id);
    },
    //TODO: varmista et toimii näin! JA laitetaanko oman db tapahtumiin locationeita ja miten?
    eventsByLocation: async (
      _parent: undefined,
      args: {location: LocationInput},
    ) => {
      return await EventModel.find({
        location: {
          $geoWithin: {
            $box: [
              [args.location.bottomLeft.lng, args.location.bottomLeft.lat],
              [args.location.topRight.lng, args.location.topRight.lat],
            ],
          },
        },
      });
    },
  },
};
