/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useContext, useEffect} from 'react';
import EventCard from '../src/components/EventCard';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {AuthContext} from '../src/context/AuthContext';
import {attendingEvents, likedEvents} from '../src/graphql/queries';
import {useQuery} from '@apollo/client';

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

  // Use the useQuery hook to make a query to get liked events and attending events
  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId, // Skip the query if userId is not defined
  });

  const {data: attendingData} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId, // Skip the query if userId is not defined
  });

  useEffect(() => {
    setIsLoading(true);
    //get all event data
    const fetchData = async () => {
      const data = await doGraphQLFetch(API_URL, getAllEvents, {});
      if (data && data.events) {
        const validEvents = data.events.filter(
          (event: any) => event && event.event_name,
        );
        console.log('validEvents', validEvents);
        setEvents(validEvents);
      }
      // Set liked events data
      console.log('likedData', likedData);
      if (likedData && likedData.favoritedEventsByUserId) {
        setLikedEventsData(likedData.favoritedEventsByUserId);
      }
      console.log('attendingData', attendingData);
      if (attendingData && attendingData.attendedEventsByUserId) {
        setAttendingEvents(attendingData.attendedEventsByUserId);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [API_URL, attendingData, isAuthenticated, likedData]);

  //TODO: Add loading state
  //TODO: add error state
  //TODO: add different sections for authenticated and non-authenticated users
  //TODO: add styiling/grid for the events
  return (
    <div className="">
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <span className="loading loading-spinner loading-xs"></span>
        </div>
      )}
      {isAuthenticated ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <div>
              <div
                className="bg-accent"
                style={{
                  padding: '2rem',
                  borderRadius: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <h1 className="title">Liked Events</h1>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                  }}
                >
                  {likedEventsData && (
                    <>
                      {likedEventsData.map((event: EventType) => (
                        <div key={event.id}>
                          <EventCard event={event} />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div>
                <div
                  className="bg-accent"
                  style={{
                    padding: '2rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <h1>attending Events</h1>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1rem',
                    }}
                  >
                    {attendingEvents && (
                      <>
                        {attendingEventsData.map((event: EventType) => (
                          <div key={event.id}>
                            <EventCard event={event} />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-accent"
              style={{
                padding: '2rem',
                borderRadius: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h1>Featured Events</h1>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                }}
              >
                {eventData.slice(0, 10).map((event: EventType) => (
                  <div key={event.id}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="bg-accent"
            style={{
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h1>Featured Events</h1>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              }}
            >
              {eventData.slice(0, 10).map((event: EventType) => (
                <div key={event.id}>
                  <EventCard event={event} />
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
