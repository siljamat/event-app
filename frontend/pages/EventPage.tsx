import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getEventById} from '../src/graphql/eventQueries';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {EventType} from '../src/types/EventType';

interface EventPageParams {
  id: string;
  [key: string]: string | undefined;
}

const EventPage: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const {id} = useParams<EventPageParams>();
  const [event, setEvent] = React.useState<EventType | undefined>(undefined);

  useEffect(() => {
    console.log('id', id);
    console.log('fetching data');
    if (!id) {
      console.log('no id');
      return;
    }
    const fetchData = async () => {
      const data = await doGraphQLFetch(API_URL, getEventById, {id});
      console.log('data', data);
      if (data) {
        setEvent(data.event);
      }
    };

    fetchData();
  }, [API_URL, id]);

  console.log('data', event);
  return (
    <div>
      <h1>Event Page</h1>
    </div>
  );
};

export default EventPage;
