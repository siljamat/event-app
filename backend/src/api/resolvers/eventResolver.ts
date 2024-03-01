import e from 'express';
import EventModel from '../models/eventModel';
import {isLoggedIn} from '../../functions/authorize';
import {MyContext} from '../../types/MyContext';
import {LocationInput, Event} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {getLocationCoordinates} from '../../functions/geocode';

export default {
  Query: {
    events: async () => {
      return await EventModel.find();
    },
    apiEvents: async () => {
      const data: any = await fetchData(
        'https://api.hel.fi/linkedevents/v1/event/?suitable_for=12',
      );
      const events: Event[] = data.data.map((event: any) => {
        //TODO: varmista et kaikki tulee oikees muodos ja hae tarvittavat jne
        return {
          id: event.id,
          created_at: event.created_time,
          event_name: event.name.fi,
          description: event.description.fi,
          date: event.start_time,
          location: event.location,
          email: '',
          organizer: event.publisher,
          address: '',
          age_restrictions: '',
          event_site: event.info_url.fi,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });
      console.log('events', events);
      return events;
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

      const {address} = args.input;
      const coords = await getLocationCoordinates(address);
      args.input.location = {
        type: 'Point',
        coordinates: [coords.lat, coords.lng],
      };

      args.input.creator = context.userdata?.user.id;
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
    // eventsByLocation: async (
    //   _parent: undefined,
    //   args: {location: LocationInput},
    // ) => {
    //   return await EventModel.find({
    //     location: {
    //       $geoWithin: {
    //         $box: [
    //           [args.location.bottomLeft.lng, args.location.bottomLeft.lat],
    //           [args.location.topRight.lng, args.location.topRight.lat],
    //         ],
    //       },
    //     },
    //   });
    // },
  },
};
