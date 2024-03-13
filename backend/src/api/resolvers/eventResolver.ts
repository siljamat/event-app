/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import e from 'express';
import EventModel from '../models/eventModel';
import {isLoggedIn} from '../../functions/authorize';
import {MyContext} from '../../types/MyContext';
import {LocationInput, Event, User} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {getLocationCoordinates} from '../../functions/geocode';
import {Console} from 'console';
import eventApiFetch from '../../functions/eventApiFetch';
import mongoose, {ObjectId} from 'mongoose';
import {updateUsersFields} from '../../utils/user';
import userResolver from './userResolver';
import CategoryModel from '../models/categoryModel';

export default {
  Query: {
    events: async () => {
      const databaseEvents = await EventModel.find();
      const apiEvents1 = await eventApiFetch(
        'https://api.hel.fi/linkedevents/v1/event/?page1&page_size=100',
      );
      const apiEvents2 = await eventApiFetch(
        'https://api.hel.fi/linkedevents/v1/event/?page=2&page_size=100',
      );
      const apiEvents3 = await eventApiFetch(
        'https://api.hel.fi/linkedevents/v1/event/?page=3&page_size=100',
      );
      const apiEvents4 = await eventApiFetch(
        'https://api.hel.fi/linkedevents/v1/event/?page=4&page_size=100',
      );
      const apiEvents = apiEvents1.concat(apiEvents2, apiEvents3, apiEvents4);
      if (!apiEvents || apiEvents.length === 0) {
        console.log('No events found from the API');
        return databaseEvents;
      }
      if (!databaseEvents || databaseEvents.length === 0) {
        console.log('No events found from the database');
        return apiEvents;
      }
      const allEvents = [...databaseEvents, ...apiEvents];
      return allEvents;
    },
    event: async (_parent: undefined, args: {id: string}) => {
      console.log('EVENT ID', args.id);
      if (mongoose.Types.ObjectId.isValid(args.id)) {
        const eventFromDb = await EventModel.findById(args.id);
        if (eventFromDb) {
          return eventFromDb;
        }
      }
      const apiEventResponse: any = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?ids=${args.id}/`,
      );
      const apiEvent = apiEventResponse[0]; // Extract the first event from the response array

      return apiEvent;
    },
    eventsByCategory: async (
      _parent: undefined,
      args: {category_name: string},
    ) => {
      // Haetaan kategoria nimen perusteella
      const categoryObj = await CategoryModel.findOne({
        category_name: args.category_name,
      });
      if (!categoryObj) {
        console.log(`Category ${args.category_name} not found from database`);
        return [];
      }
      // Haetaan tapahtumat kategorian id:n perusteella
      const databaseEvents = await EventModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryObj',
          },
        },
        {
          $match: {
            'categoryObj._id': new mongoose.Types.ObjectId(categoryObj._id),
          },
        },
      ]);
      // Haetaan APIsta kaikki tapahtumat kategorian perusteella
      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?text=${args.category_name}`,
      );
      console.log('apiEvents lenght:', apiEvents.length);
      // Yhdistetään tietokannasta ja APIsta haetut tapahtumat ja palautetaan ne
      const combinedEvents = [...databaseEvents, ...apiEvents];
      return combinedEvents;
    },
    eventsByDate: async (_parent: undefined, args: {date: Date | string}) => {
      let {date} = args;
      if (typeof date === 'string') {
        date = new Date(date);
      }

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const databaseEvents = await EventModel.find({
        date: {
          $gte: date,
          $lt: nextDay,
        },
      });

      let apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?start=${date.toISOString()}&end=${nextDay.toISOString()}`,
      );

      // Filter the events from the API to only include events that both start and end on the specified date
      apiEvents = apiEvents.filter((event) => {
        if (event) {
          const eventDate = new Date(event.date);
          return eventDate >= date && eventDate < nextDay;
        }
        return false;
      });

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
      return combinedEvents;
    },
    eventsByMinAge: async (_parent: undefined, args: {age: string}) => {
      const databaseEvents = await EventModel.find({age_restriction: args.age});
      const apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?audience_min_age=${args.age}`,
      );
      const combinedEvents = [...databaseEvents, ...apiEvents];
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
    eventsByTitle: async (_parent: undefined, args: {keyword: string}) => {
      // Haetaan tietokannasta tapahtumat, joiden event_name sisältää hakusanan
      const {keyword} = args;
      const databaseEvents = await EventModel.find({
        event_name: {$regex: new RegExp(keyword, 'i')},
      });
      let apiEvents = await eventApiFetch(
        `https://api.hel.fi/linkedevents/v1/event/?text=${keyword}`,
      );
      // Filteröidään APIsta haetut tapahtumat, joiden event_name sisältää hakusanan
      apiEvents = apiEvents.filter(
        (event) =>
          event &&
          event.event_name &&
          event.event_name.toLowerCase().includes(keyword.toLowerCase()),
      );
      const combinedEvents = [...databaseEvents, ...apiEvents];
      // Filteröidään pois tapahtumat, joissa event_name on undefined/null
      const filteredEvents = combinedEvents.filter(
        (event) => event && event.event_name,
      );
      return filteredEvents;
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

      // if (args.input.address) {
      //   const {address} = args.input;
      //   const coords = await getLocationCoordinates(address);
      //   args.input.location = {
      //     type: 'Point',
      //     coordinates: [coords.lat, coords.lng],
      //   };
      // }
      const updatedEvent = await EventModel.findByIdAndUpdate(
        args.id,
        args.input,
        {
          new: true,
        },
      );
      console.log('Event updated successfully!' + updatedEvent);
      return updatedEvent;
    },
    deleteEvent: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isLoggedIn(context);
      try {
        const event = await EventModel.findById(args.id);
        if (!event) {
          throw new Error('Event not found from the database!');
        }
        // Poistetaan tapahtuman id käyttäjän createdEvents kentästä
        await fetchData<Response>(
          `${process.env.AUTH_URL}/users/${event.creator}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.userdata?.token}`,
            },
            body: JSON.stringify({
              createdEvents: (
                context.userdata?.user.createdEvents || []
              ).filter((eventId) => eventId.toString() !== args.id),
            }),
          },
        );
        // Poistetaan tapahtuma tietokannasta
        await EventModel.findByIdAndDelete(args.id);
        console.log('Event deleted successfully!');
        return {
          message: 'Event deleted successfully!',
          success: true,
        };
      } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event.');
      }
    },
  },
};
