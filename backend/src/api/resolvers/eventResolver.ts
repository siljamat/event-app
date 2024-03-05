/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import e from 'express';
import EventModel from '../models/eventModel';
import {isLoggedIn} from '../../functions/authorize';
import {MyContext} from '../../types/MyContext';
import {LocationInput, Event} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {getLocationCoordinates} from '../../functions/geocode';
import {Console} from 'console';

// API haut voi siirtää jossain vaiheessa omaan tiedostoon jos tuntuu että
// tämä tiedosto alkaa paisumaan liikaa
export default {
  Query: {
    events: async () => {
      const databaseEvents = await EventModel.find();

      const apiData: any = await fetchData(
        'https://api.hel.fi/linkedevents/v1/event/?suitable_for=12',
      );
      const apiEvents = apiData.data.map((event: any) => {
        //TODO: varmista et kaikki tulee oikees muodos ja hae tarvittavat jne
        return {
          id: event.id,
          created_at: event.created_time,
          event_name: event.name.fi,
          category: event.suitable_for,
          description: event.description.fi,
          date: event.start_time,
          location: event.location,
          email: '',
          organizer: event.publisher,
          address: '',
          age_restrictions: '',
          event_site: event.info_url,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    event: async (_parent: undefined, args: {id: string}) => {
      return await EventModel.findById(args.id);
    },

    apiEvent: async (_parent: undefined, args: {id: string}) => {
      const data: any = await fetchData(
        `https://api.hel.fi/linkedevents/v1/event/${args.id}/`,
      );
      return {
        id: data.id,
        created_at: data.created_time,
        event_name: data.name.fi,
        description: data.description.fi,
        date: data.start_time,
        location: data.location,
        email: '',
        organizer: data.publisher,
        address: '',
        age_restrictions: '',
        event_site: data.info_url,
        ticket_site: '',
        price: '',
        image: data.images[0],
        audience_min_age: data.audience_min_age,
        audience_max_age: data.audience_max_age,
      };
    },

    //TODO: Mistä saadaan vaadittava category id?
    eventsByCategory: async (_parent: undefined, args: {category: string}) => {
      const databaseEvents = await EventModel.find({category: args.category});

      const apiData: any = await fetchData(
        `https://api.hel.fi/linkedevents/v1/event/?suitable_for=${args.category}`,
      );
      const apiEvents: Event[] = apiData.data.map((event: any) => {
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
          event_site: event.info_url,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });
      const combinedEvents = [...databaseEvents, ...apiEvents];
      return combinedEvents;
    },

    eventsByDate: async (_parent: undefined, args: {date: Date}) => {
      const databaseEvents = await EventModel.find({date: args.date});

      const apiData: any = await fetchData(
        `https://api.hel.fi/linkedevents/v1/event/?start=${args.date}`,
      );
      const apiEvents: Event[] = apiData.data.map((event: any) => {
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
          event_site: event.info_url,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });

      const combinedEvents = [...databaseEvents, ...apiEvents];
      return combinedEvents;
    },

    eventsByPrice: async (_parent: undefined, args: {price: string}) => {
      const databaseEvents = await EventModel.find({price: args.price});

      const apiData: any = await fetchData(
        `https://api.hel.fi/linkedevents/v1/event/?price=${args.price}`,
      );
      const apiEvents: Event[] = apiData.data.map((event: any) => {
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
          event_site: event.info_url,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });

      const combinedEvents = [...databaseEvents, ...apiEvents];
      return combinedEvents;
    },

    eventsByOrganizer: async (
      _parent: undefined,
      args: {organizer: string},
    ) => {
      return await EventModel.find({organizer: args.organizer});
    },
    apiEventsByOrganizer: async (
      _parent: undefined,
      args: {organizer: string},
    ) => {
      const data: any = await fetchData(
        `https://api.hel.fi/linkedevents/v1/event/?publisher=${args.organizer}`,
      );
      const events: Event[] = data.data.map((event: any) => {
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
          event_site: event.info_url,
          ticket_site: '',
          price: '',
          image: event.images[0],
          audience_min_age: event.audience_min_age,
          audience_max_age: event.audience_max_age,
        };
      });
      return events;
    },
    eventsByMinAge: async (_parent: undefined, args: {age: string}) => {
      return await EventModel.find({age_restriction: args.age});
    },
    eventsByArea: async (_parent: undefined, args: {address: string}) => {
      const coords = await getLocationCoordinates(args.address);
      return await EventModel.find({
        location: {
          $geoWithin: {
            $centerSphere: [[coords.lat, coords.lng], 10 / 6378.1], //10km säteellä
          },
        },
      });
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
      console.log('CREATE EVENT creator id', args.input.creator);
      return await EventModel.create(args.input);
    },
    //TODO: Figure out why creator is undefined here and fix it
    updateEvent: async (
      _parent: undefined,
      args: {id: string; input: Partial<Omit<Event, 'id'>>},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      const id = args.input.creator?.id;
      console.log('UPDATE EVENT creator id', id);
      console.log('UPDATE EVENT', args.input);
      if (
        id === context.userdata?.user.id ||
        context.userdata?.user.role === 'admin'
      ) {
        // if (args.input.address) {
        //   const {address} = args.input;
        //   const coords = await getLocationCoordinates(address);
        //   args.input.location = {
        //     type: 'Point',
        //     coordinates: [coords.lat, coords.lng],
        //   };
        // }
        return await EventModel.findByIdAndUpdate(args.id, args.input, {
          new: true,
        });
      }
      throw new Error('Not authorized');
    },
    deleteEvent: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      const event = await EventModel.findById(args.id);
      console.log('DELETE EVENT event creator:', event?.creator);
      if (
        context.userdata?.user.role === 'admin' ||
        (event && context.userdata?.user.id === event.creator)
      ) {
        return await EventModel.findByIdAndDelete(args.id);
      }
      throw new Error('Not authorized');
    },
  },
};
