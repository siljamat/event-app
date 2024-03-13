/* eslint-disable @typescript-eslint/no-explicit-any */
import {Event, User} from '../types/DBTypes';
import fetchData from './fetchData';

//TODO: OPTIMIZE THIS FUNCTION
const eventApiFetch = async (url: string, options: RequestInit = {}) => {
  const data: any[] = await fetchData(url, options);
  const apiUser = await fetchData<User>(
    `${process.env.AUTH_URL}/users/65f1516db4691e19125aa2c6`,
  );
  if (!apiUser) throw new Error('No user');
  console.log('apiUser', apiUser);
  if (data) {
    const apiEventData: Partial<Event>[] = await Promise.all(
      (data as any).data.map(async (event: any) => {
        // Fetch the location details
        const locationData: any = await fetchData(event.location['@id']);
        try {
          return {
            id: event.id,
            category: event.keywords
              ? event.keywords.map((keyword: any) => keyword.name)
              : [],
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
        } catch (error) {
          console.error('Error processing event:', event, error);
          return null; // Return null when there's an error
        }
      }),
    );

    const eventNames = new Set();
    const uniqueEvents = apiEventData.filter((event: any) => {
      if (eventNames.has(event.event_name)) {
        return false;
      }
      eventNames.add(event.event_name);
      return true;
    });
    const apiEvents = uniqueEvents.map((event: any) => {
      try {
        return {
          address: event.address ? event.address : 'No address',
          age_restriction: event.audience_min_age
            ? event.audience_min_age + '-' + event.audience_max_age
            : '',
          category: event.keywords
            ? event.keywords.map((keyword: any) => keyword.name)
            : [],
          created_at: event.created_at,
          date: event.date,
          description: event.description,
          email: event.email,
          event_name: event.event_name,
          event_site: event.event_site ? event.event_site.fi : 'no site',
          id: event.id,
          image: event.image ? event.image.url : 'No image',
          location: event.location,
          organizer: event.organizer,
          price: event.price,
          ticket_site: event.ticket_site,
          creator: apiUser._id,
        };
      } catch (error) {
        console.error('Error mapping event:', event, error);
      }
    });
    console.log('apiEvents', apiEvents.length);
    return apiEvents;
  }
  throw new Error('No data');
};
export default eventApiFetch;
