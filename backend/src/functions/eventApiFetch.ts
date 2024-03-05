/* eslint-disable @typescript-eslint/no-explicit-any */
import {Event} from '../types/DBTypes';
import fetchData from './fetchData';

const eventApiFetch = async (url: string, options: RequestInit = {}) => {
  const data: any[] = await fetchData(url, options);
  if (data) {
    const apiEvents: Partial<Event>[] = (data as any).data.map((event: any) => {
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
    return apiEvents;
  }
  throw new Error('No data');
};
export default eventApiFetch;
