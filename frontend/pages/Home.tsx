import React, {useContext, useEffect} from 'react';
import EventCard from '../src/components/EventCard';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {AuthContext} from '../src/context/AuthContext';
import {attendingEvents, likedEvents} from '../src/graphql/queries';
import {UserContext} from '../src/context/UserContext';

const Home: React.FC = () => {
  const [eventData, setEvents] = React.useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [likedEventsData, setLikedEventsData] = React.useState<EventType[]>([]);
  const [attendingEventsData, setAttendingEvents] = React.useState<EventType[]>(
    [],
  );
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setIsLoading(true);
    console.log('fetching data');
    console.log('isAuthenticated', isAuthenticated, user);
    const fetchData = async () => {
      const data = await doGraphQLFetch(API_URL, getAllEvents, {});
      if (data && data.events) {
        const eventNames = new Set();
        const uniqueEvents = data.events.filter((event) => {
          if (event !== null && !eventNames.has(event.event_name)) {
            eventNames.add(event.event_name);
            return true;
          }
          return false;
        });
        setEvents(uniqueEvents);
      }
      setIsLoading(false);
    };
    const fetchAttending = async () => {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: attendingEvents,
          variables: {
            userId: userId,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      console.log('attending events', data.data.attendedEventsByUserId);
      setAttendingEvents(data.data.attendedEventsByUserId);
    };
    const fetchLikedEvents = async () => {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: likedEvents,
          variables: {
            userId: userId,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      setLikedEventsData(data.data.favoritedEventsByUserId);
    };
    if (isAuthenticated) {
      fetchLikedEvents();
      fetchAttending();
    }

    fetchData();
  }, [API_URL, isAuthenticated]);

  //TODO: Add loading state
  //TODO: add error state
  //TODO: add different sections for authenticated and non-authenticated users
  //TODO: add styiling/grid for the events
  return (
    <div className="flex items-center justify-center grid grid-cols-3 ">
      <div className="flex items-center justify-center ">
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </div>

      {isAuthenticated ? (
        <>
          <div className="">
            <div>
              {likedEventsData && likedEventsData.length > 0 && (
                <>
                  <h1>Liked Events</h1>
                  {likedEventsData.map((event: EventType) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </>
              )}
            </div>
            <div>
              {attendingEvents && attendingEvents.length > 0 && (
                <>
                  <h1>Attending</h1>
                  {attendingEventsData.map((event: EventType) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </>
              )}
            </div>
            <div>
              <h1>Featured Events</h1>
              {eventData.slice(0, 10).map((event: EventType) => (
                <div key={event.id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row ">
            <div className="">
              <h1 className="text-2xl font-bold text-center mb-4">
                Featured Events
              </h1>
              {eventData.slice(0, 10).map((event: EventType) => (
                <div className="">
                  <EventCard key={event.id} event={event} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Home;
