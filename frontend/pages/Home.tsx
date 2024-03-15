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

/**
 * Home component fetches and displays all events, liked events and attending events.
 * @returns {JSX.Element} The rendered Home component.
 */
const Home: React.FC = () => {
  const isSmallScreen = useMediaQuery({query: '(max-width: 1200px)'});
  const isMobile = useMediaQuery({query: '(max-width: 650px)'});

  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * @type {React.State<EventType[]>} eventData - The state variable where the events are stored.
   * @function setEvents - The function to update the events state.
   */
  const [eventData, setEvents] = useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);

  /**
   * @type {React.State<boolean>} isLoading - The state variable that indicates whether the events are being loaded.
   * @function setIsLoading - The function to update the isLoading state.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @type {React.State<EventType[]>} likedEventsData - The state variable where the liked events are stored.
   * @function setLikedEventsData - The function to update the likedEventsData state.
   */
  const [likedEventsData, setLikedEventsData] = useState<EventType[]>([]);

  /**
   * @type {React.State<EventType[]>} attendingEventsData - The state variable where the attending events are stored.
   * @function setAttendingEvents - The function to update the attendingEventsData state.
   */
  const [attendingEventsData, setAttendingEvents] = useState<EventType[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  /**
   * @type {object} likedData - The data returned from the likedEvents query.
   */
  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  /**
   * @type {object} attendingData - The data returned from the attendingEvents query.
   */
  const {data: attendingData} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });

  //set event data
  useEffect(() => {
    setIsLoading(true);
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

  // Set liked events data
  useEffect(() => {
    if (likedData && likedData.favoritedEventsByUserId) {
      setLikedEventsData(likedData.favoritedEventsByUserId);
    }
  }, [likedData]);

  // Set attending events data
  useEffect(() => {
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
                  <h1 className="text-2xl text-center mb-5">Liked events </h1>
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
                    {likedEventsData && (
                      <>
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
                          {likedEventsData.map((event: EventType) => (
                            <div key={event.id}>
                              <EventCard event={event} />
                            </div>
                          ))}
                        </div>
                        {likedEventsData.length === 0 && (
                          <div className="flex justify-center">
                            <p className=" text text-l text-center bg-base-100 p-10 rounded-lg">
                              You have not liked any events yet{' '}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl text-center mb-5">
                      Events you plan to attend
                    </h1>
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
                      {attendingEvents && (
                        <>
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
                            {attendingEventsData.map((event: EventType) => (
                              <div key={event.id}>
                                <EventCard event={event} />
                              </div>
                            ))}
                          </div>

                          {attendingEventsData.length === 0 && (
                            <div className="flex justify-center">
                              <p className=" text text-l text-center bg-base-100 p-10 rounded-lg">
                                You have not planned to attend any events yet
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl text-center mb-5">Featured Events</h1>
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
                <div
                  style={{
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: isMobile ? 'column' : 'unset',
                    gridTemplateColumns: isMobile ? 'unset' : 'repeat(2, 1fr)',
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
                {displayCount < eventData.length && (
                  <button
                    className=" justify-end btn btn-ghost btn-sm mt-5"
                    onClick={() => setDisplayCount(displayCount + 20)}
                  >
                    See More
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl text-center mb-5">Featured Events</h1>

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
                {displayCount < eventData.length && (
                  <button
                    className=" justify-end btn btn-ghost btn-sm mt-5"
                    onClick={() => setDisplayCount(displayCount + 20)}
                  >
                    See More
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Home;
