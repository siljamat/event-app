import mongoose from 'mongoose';
import {Event} from '../../types/DBTypes';

/**
 * Mongoose model class for handling events.
 * @class
 */
const eventSchema = new mongoose.Schema<Event>({
  /**
   * The timestamp when the event was created.
   * @type {Date}
   * @default Date.now
   */
  created_at: {
    type: Date,
    default: Date.now,
  },
  /**
   * The name of the event.
   * @type {string}
   */
  event_name: {
    type: String,
  },
  /**
   * The category of the event.
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref 'Category'
   */
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  /**
   * The location of the event.
   * @type {object}
   */
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
  /**
   * The address of the event.
   * @type {string}
   */
  address: {
    type: String,
  },
  /**
   * The creator of the event.
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref 'User'
   */
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  /**
   * The description of the event.
   * @type {string}
   * @required
   */
  description: {
    type: String,
    required: true,
  },
  /**
   * The date of the event.
   * @type {Date}
   * @required
   */
  date: {
    type: Date,
    required: true,
  },
  /**
   * The email associated with the event.
   * @type {string}
   */
  email: {
    type: String,
  },
  /**
   * The organizer of the event.
   * @type {string}
   */
  organizer: {
    type: String,
  },
  /**
   * The age restriction for the event.
   * @type {string}
   */
  age_restriction: {
    type: String,
  },
  /**
   * The website of the event.
   * @type {string}
   */
  event_site: {
    type: String,
  },
  /**
   * The website for purchasing tickets for the event.
   * @type {string}
   */
  ticket_site: {
    type: String,
  },
  /**
   * The price of the event.
   * @type {string}
   */
  price: {
    type: String,
  },
  /**
   * The URL of the image associated with the event.
   * @type {string}
   */
  image: {
    type: String,
  },
  /**
   * The count of users who have favorited the event.
   * @type {number}
   * @default 0
   */
  favoriteCount: {
    type: Number,
    default: 0,
  },
  /**
   * The users who have favorited the event.
   * @type {mongoose.Schema.Types.ObjectId[]}
   * @ref 'User'
   */
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  /**
   * The count of users who are attending the event.
   * @type {number}
   * @default 0
   */
  attendeeCount: {
    type: Number,
    default: 0,
  },
  /**
   * The users who are attending the event.
   * @type {mongoose.Schema.Types.ObjectId[]}
   * @ref 'User'
   */
  attendedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

/**
 * Mongoose model for handling the event collection.
 * @type {mongoose.Model<Event>}
 */
const EventModel = mongoose.model<Event>('Event', eventSchema);

export default EventModel;
