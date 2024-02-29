import mongoose from 'mongoose';
import {Event} from '../../types/DBTypes';

const eventSchema = new mongoose.Schema<Event>({
  created_at: {
    type: Date,
    default: Date.now,
  },
  event_name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
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
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  age_restriction: {
    type: String,
    required: true,
  },
  event_site: {
    type: String,
  },
  ticket_site: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const EventModel = mongoose.model<Event>('Event', eventSchema);

export default EventModel;
