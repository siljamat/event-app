import React, {useContext, useEffect} from 'react';
import EventCard from '../src/components/EventCard';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {AuthContext} from '../src/context/AuthContext';

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
      if (data && data.data) {
        setEvents(data.data);
      }
    };

    fetchData();
  }, [API_URL, eventData]);

  return (
    <div>
      <h1>FrontPage</h1>
      {isAuthenticated ? (
        <>
          {/*saved events, attending featured etc when user logged in create containers etc*/}
          <div>
            <h1>AUTHENTICATED</h1>
            {/* TODO: add fix event card and take out of comments after that and make sure the mapping works*/}
            {/* {eventData &&
        eventData.map((event: EventType) => <EventCard eventType={event} />)} */}
          </div>
        </>
      ) : (
        <>
          <div>
            <h1>NOT AUTHENTICATED</h1>
          </div>
        </>
      )}
    </div>
  );
};
export default Home;
