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
import eventApiFetch from '../../functions/eventApiFetch';

export default {
  Query: {
    events: async () => {
      const databaseEvents = await EventModel.find();
      const apiEvents = await eventApiFetch(
        'https://api.hel.fi/linkedevents/v1/event/?suitable_for=12',
      );
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

    //TODO: Täytyy odottaa että categor toimii
    eventsByCategory: async (_parent: undefined, args: {category: string}) => {
      const databaseEvents = await EventModel.find({category: args.category});

      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?suitable_for=${args.category}`,
      );
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    eventsByDate: async (_parent: undefined, args: {date: Date}) => {
      const databaseEvents = await EventModel.find({date: args.date});

      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?start=${args.date}`,
      );
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    eventsByPrice: async (_parent: undefined, args: {price: string}) => {
      const databaseEvents = await EventModel.find({price: args.price});

      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?price=${args.price}`,
      );
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    eventsByOrganizer: async (
      _parent: undefined,
      args: {organizer: string},
    ) => {
      const databaseEvents = await EventModel.find({organizer: args.organizer});

      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?publisher=${args.organizer}`,
      );
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    eventsByMinAge: async (_parent: undefined, args: {age: string}) => {
      const databaseEvents = await EventModel.find({age_restriction: args.age});

      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?audience_min_age=${args.age}`,
      );
      console.log('apiEvents', apiEvents);
      const combinedEvents = [...databaseEvents, ...apiEvents];
      console.log('combinedEvents', combinedEvents);
      return combinedEvents;
    },

    eventsByArea: async (_parent: undefined, args: {address: string}) => {
      try {
        const coords = await getLocationCoordinates(args.address);

        const databaseEvents = await EventModel.find({
          location: {
            $geoWithin: {
              $centerSphere: [[coords.lat, coords.lng], 10 / 6378.1], // 10 km säteellä
            },
          },
        });

        const apiEvents = await eventApiFetch(
          `https://api.hel.fi/linkedevents/v1/event/?location=${encodeURIComponent(args.address)}&radius=10000`,
        );
        console.log('apiEvents', apiEvents);
        const combinedEvents = [...databaseEvents, ...apiEvents];
        console.log('combinedEvents', combinedEvents);
        return combinedEvents;
      } catch (error) {
        console.error('Error fetching events by area:', error);
        throw new Error('Error fetching events by area');
      }
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
      // Lisätään luodun tapahtuman id käyttäjän tietoihin
      const createdEvent = await EventModel.create(args.input);
      await fetchData<Response>(
        `${process.env.AUTH_URL}/users/${context.userdata?.user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.userdata?.token}`,
          },
          body: JSON.stringify({
            $push: {createdEvents: createdEvent._id},
          }),
        },
      );
      return createdEvent;
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
      throw new Error(
        'Not authorized. You must be the creator of this event to edit it.',
      );
    },
    deleteEvent: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      const event = await EventModel.findById(args.id);
      if (!event) {
        throw new Error('Event not found from database!');
      }
      // Tarkistetaan, että käyttäjä on tapahtuman luoja
      if (String(context.userdata?.user.id) === String(event.creator)) {
        // Poistetaan tapahtuma
        await EventModel.findByIdAndDelete(args.id);
        // Poistetaan tapahtuma myös käyttäjän tiedoista
        await fetchData<Response>(
          `${process.env.AUTH_URL}/users/${context.userdata?.user.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
            body: JSON.stringify({
              $pull: {createdEvents: args.id},
            }),
          },
        );
        console.log('Event deleted successfully!');
        return true;
      } else {
        throw new Error(
          'Not authorized. You must be the creator of this event to delete it.',
        );
      }
    },
  },
};
