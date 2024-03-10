import React, {useContext, useEffect} from 'react';
import EventCard from '../src/components/EventCard';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {AuthContext} from '../src/context/AuthContext';
import {is} from '@babel/types';

const Home: React.FC = () => {
  const [eventData, setEvents] = React.useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('fetching data');
    console.log('isAuthenticated', isAuthenticated);
    const fetchData = async () => {
      const data = await doGraphQLFetch(API_URL, getAllEvents, {});
      console.log('data', data);
      if (data && data.events) {
        const validEvents = data.events.filter((event) => event !== null);
        setEvents(validEvents);
      }
    };

    fetchData();
  }, [API_URL, isAuthenticated]);

  //TODO: Add loading state
  //TODO: add error state
  //TODO: add different sections for authenticated and non-authenticated users
  //TODO: add styiling/grid for the events
  return (
    <div>
      <h1>FrontPage</h1>
      {isAuthenticated ? (
        <>
          <div className="">
            <h1>AUTHENTICATED</h1>
            {eventData.slice(0, 10).map((event: EventType) => (
              <div className="">
                <EventCard key={event.id} event={event} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="">
            <h1>NOT AUTHENTICATED</h1>
            {eventData.slice(0, 10).map((event: EventType) => (
              <div className="">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Home;
