import mongoose from 'mongoose';
import {Event} from '../../types/DBTypes';

const eventSchema = new mongoose.Schema<Event>({
  created_at: {
    type: Date,
    default: Date.now,
  },
  event_name: {
    type: String,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  address: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
  },
  organizer: {
    type: String,
  },
  age_restriction: {
    type: String,
  },
  event_site: {
    type: String,
  },
  ticket_site: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  attendeeCount: {
    type: Number,
    default: 0,
  },
  attendedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const EventModel = mongoose.model<Event>('Event', eventSchema);

export default EventModel;
