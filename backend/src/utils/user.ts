import {User} from '../types/DBTypes';
import fetchData from '../functions/fetchData';
import {MyContext} from '../types/MyContext';
import EventModel from '../api/models/eventModel';
import {ObjectId} from 'mongoose';

export const updateUsersFields = async (
  eventId: ObjectId,
  context: MyContext,
) => {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error('Event not found from the database!');
  }
  const userIds = [...event.favoritedBy, ...event.attendedBy];
  for (let userId of userIds) {
    console.log(userId);
    const user = await fetchData<User>(
      `${process.env.AUTH_URL}/users/${userId}`,
    );
    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      continue;
    }
    const updatedUser = {
      favoritedEvents: user.favoritedEvents.filter(
        (id) => id.toString() !== eventId.toString(),
      ),
      attendedEvents: user.attendedEvents.filter(
        (id) => id.toString() !== eventId.toString(),
      ),
    };
    console.log(updatedUser);
    await fetchData<Response>(`${process.env.AUTH_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.userdata?.token}`,
      },
      body: JSON.stringify(updatedUser),
    });
  }
};
