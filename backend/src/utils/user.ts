import {User} from '../types/DBTypes';
import fetchData from '../functions/fetchData';
import {MyContext} from '../types/MyContext';
import EventModel from '../api/models/eventModel';

export const updateUsersFields = async (
  eventId: string,
  context: MyContext,
) => {
  // Fetch the event document
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error('Event not found from the database!');
  }

  // Extract user ids
  const userIds = [...event.favoritedBy, ...event.attendedBy];

  // Fetch and update each user document
  for (let userId of userIds) {
    console.log(userId);
    const user = await fetchData<User>(
      `${process.env.AUTH_URL}/users/${userId}`,
    );

    // Remove the event id from the relevant fields
    const updatedUser = {
      favoritedEvents: user.favoritedEvents.filter(
        (id) => id.toString() !== eventId,
      ),
    };
    console.log(updatedUser);
    // Save the updated user document
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
