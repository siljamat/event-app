import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getEventById} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {useQuery} from '@apollo/client';

interface EventPageParams {
  id: string;
  [key: string]: string | undefined;
}

const EventPage: React.FC = () => {
  const {eventId} = useParams<EventPageParams>();
  const [event, setEvent] = React.useState<EventType | undefined>(undefined);
  const {loading, error, data} = useQuery(getEventById, {
    variables: {id: eventId},
  });

  useEffect(() => {
    if (data && data.event) {
      setEvent(data.event);
    }
  }, [data]);

  console.log('data', data);

  //TODO: Add a loading spinner
  // add styling
  //add share button
  //add like button
  //add attending button
  //show attending count
  //show like count
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div>
        <h1>{event?.event_name}</h1>
        <p>{event?.description}</p>
        <p>{event?.date}</p>
        <p>{event?.address}</p>
        <p>{event?.price}</p>
        <p>{event?.organizer}</p>
        <p>{event?.email}</p>
        <p>{event?.event_site}</p>
        <p>{event?.ticket_site}</p>
        <p>{event?.age_restriction}</p>
        <p>{event?.category?.category_name}</p>
        <p>{event?.location?.coordinates}</p>
        <p>{event?.favoriteCount}</p>
        <p>{event?.attendeeCount}</p>
        <p>{event?.image}</p>
        <button>Share</button>
        <button>Like</button>
      </div>
    </div>
  );
};

export default EventPage;
