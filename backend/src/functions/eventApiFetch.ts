/* eslint-disable @typescript-eslint/no-explicit-any */
import {Event, User} from '../types/DBTypes';
import fetchData from './fetchData';

const eventApiFetch = async (url: string, options: RequestInit = {}) => {
  const data: any[] = await fetchData(url, options);
  const apiUser = await fetchData<User>(
    `${process.env.AUTH_URL}/users/65ec9e7def56a518d78085cb`,
  );
  if (data) {
    const apiEventData: Partial<Event>[] = await Promise.all(
      (data as any).data.map(async (event: any) => {
        // Fetch the location details
        const locationData: any = await fetchData(event.location['@id']);

        return {
          id: event.id,
          created_at: event.created_time,
          event_name: event.name.fi,
          description: event.description.fi,
          date: event.start_time,
          location: locationData.position,
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
      }),
    );
    const eventNames = new Set();
    const uniqueEvents = apiEventData.filter((event: any) => {
      if (eventNames.has(event.event_name) || event.event_name === null) {
        return false;
      }
      eventNames.add(event.event_name);
      return true;
    });
    console.log('uniqueEvents', uniqueEvents);

    const apiEvents = uniqueEvents.map((event: any) => ({
      address: event.address,
      age_restriction: event.audience_min_age
        ? event.audience_min_age + '-' + event.audience_max_age
        : '',
      //TODO: FIX!! maybe map and check if any keywords match our cateogry names and
      category: event.keywords
        ? event.keywords.map((keyword: any) => keyword.name)
        : [],
      created_at: event.created_at,
      date: event.date,
      description: event.description,
      email: event.email,
      event_name: event.event_name,
      event_site: event.event_site ? event.event_site.fi : '',
      favoriteCount: 0,
      id: event.id,
      image: event.image ? event.image.url : '',
      location: event.location,
      organizer: event.organizer,
      price: event.price,
      ticket_site: event.ticket_site,
      creator: apiUser._id,
    }));
    return apiEvents;
  }
  throw new Error('No data');
};
export default eventApiFetch;
