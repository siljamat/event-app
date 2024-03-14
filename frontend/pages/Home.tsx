/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useContext, useEffect, useState} from 'react';
import EventCard from '../src/components/EventCard';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {AuthContext} from '../src/context/AuthContext';
import {attendingEvents, likedEvents} from '../src/graphql/queries';
import {useQuery} from '@apollo/client';
import {useMediaQuery} from 'react-responsive';

const Home: React.FC = () => {
  const isSmallScreen = useMediaQuery({query: '(max-width: 1200px)'});
  const isMobile = useMediaQuery({query: '(max-width: 650px)'});

  const [eventData, setEvents] = useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [likedEventsData, setLikedEventsData] = useState<EventType[]>([]);
  const [attendingEventsData, setAttendingEvents] = useState<EventType[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const API_URL = import.meta.env.VITE_API_URL;

  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  const {data: attendingData} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });

  useEffect(() => {
    setIsLoading(true);
    //get all event data
    const fetchEventData = async () => {
      const data = await doGraphQLFetch(API_URL, getAllEvents, {});
      if (data && data.events) {
        const validEvents = data.events.filter(
          (event: any) => event && event.event_name,
        );
        setEvents(validEvents);
      }
      setIsLoading(false);
    };
    fetchEventData();
  }, [API_URL]);

  useEffect(() => {
    // Set liked events data
    if (likedData && likedData.favoritedEventsByUserId) {
      setLikedEventsData(likedData.favoritedEventsByUserId);
    }
  }, [likedData]);

  useEffect(() => {
    // Set attending events data
    if (attendingData && attendingData.attendedEventsByUserId) {
      setAttendingEvents(attendingData.attendedEventsByUserId);
    }
  }, [attendingData]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
          }}
        >
          <span className="loading loading-spinner loading-xs"></span>
        </div>
      ) : (
        <div>
          {isAuthenticated ? (
            <>
              <div
                style={{
                  display: isSmallScreen ? 'flex' : 'grid',
                  flexDirection: isSmallScreen ? 'column' : 'unset',
                  gridTemplateColumns: isSmallScreen
                    ? 'unset'
                    : 'repeat(2, 1fr)',
                  gap: '10px',
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
                      marginRight: '1rem',
                      marginLeft: '1rem',
                    }}
                  >
                    <h1 className="text-2xl text-center">Liked Events</h1>
                    <div
                      style={{
                        display: isMobile ? 'flex' : 'grid',
                        flexDirection: isMobile ? 'column' : 'unset',
                        gridTemplateColumns: isMobile
                          ? 'unset'
                          : 'repeat(2, 1fr)',
                        gap: '1rem',
                        maxWidth: '100%',
                        overflowX: 'auto',
                      }}
                    >
                      {likedEventsData && (
                        <>
                          {likedEventsData.map((event: EventType) => (
                            <div key={event.id}>
                              <EventCard event={event} />
                            </div>
                          ))}
                          {likedEventsData.length === 0 && (
                            <p>You have not liked any events yet</p>
                          )}
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
                        marginRight: '1rem',
                        marginLeft: '1rem',
                      }}
                    >
                      <h1 className="text-2xl text-center">
                        Events you plan to attend
                      </h1>
                      <div
                        style={{
                          display: isMobile ? 'flex' : 'grid',
                          flexDirection: isMobile ? 'column' : 'unset',
                          gridTemplateColumns: isMobile
                            ? 'unset'
                            : 'repeat(2, 1fr)',
                          gap: '1rem',
                          maxWidth: '100%',
                          overflowX: 'auto',
                        }}
                      >
                        {attendingEvents && (
                          <>
                            {attendingEventsData.map((event: EventType) => (
                              <div key={event.id}>
                                <EventCard event={event} />
                              </div>
                            ))}
                            {attendingEventsData.length === 0 && (
                              <p className=" text text-l">
                                You have not planned to attend any events yet
                              </p>
                            )}
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
                    marginRight: '1rem',
                    marginLeft: '1rem',
                  }}
                >
                  <h1 className="text-2xl text-center">Featured Events</h1>
                  <div
                    style={{
                      display: isMobile ? 'flex' : 'grid',
                      flexDirection: isMobile ? 'column' : 'unset',
                      gridTemplateColumns: isMobile
                        ? 'unset'
                        : 'repeat(2, 1fr)',
                      gap: '1rem',
                      maxWidth: '100%',
                      overflowX: 'auto',
                    }}
                  >
                    {eventData
                      .slice(0, displayCount)
                      .map((event: EventType) => (
                        <div key={event.id}>
                          <EventCard event={event} />
                        </div>
                      ))}
                  </div>
                  <button
                    className=" justify-end btn btn-ghost btn-sm mt-5"
                    onClick={() => setDisplayCount(displayCount + 20)}
                  >
                    See More
                  </button>
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
                  marginRight: '1rem',
                  marginLeft: '1rem',
                }}
              >
                <h1 className="text text-xl font-bold flex justify-center">
                  Featured Events
                </h1>
                <div
                  style={{
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: isMobile ? 'column' : 'unset',
                    gridTemplateColumns: isMobile ? 'unset' : 'repeat(3, 1fr)',
                    gap: '1rem',
                    maxWidth: '100%',
                    overflowX: 'auto',
                  }}
                >
                  {eventData.slice(0, displayCount).map((event: EventType) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
                <button
                  className=" justify-end btn btn-ghost btn-sm mt-5"
                  onClick={() => setDisplayCount(displayCount + 20)}
                >
                  See More
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Home;
