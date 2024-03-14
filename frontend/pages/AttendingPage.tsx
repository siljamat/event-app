import React, {useEffect} from 'react';
import {EventType} from '../src/types/EventType';
import {attendingEvents} from '../src/graphql/queries';
import {useQuery} from '@apollo/client';
import EventCard from '../src/components/EventCard';

const AttendingPage = () => {
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const [events, setEvents] = React.useState<EventType[]>([]);

  // Get liked events
  const {data, loading} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });

  // Set liked events data
  useEffect(() => {
    if (data && data.attendedEventsByUserId) {
      console.log('data', data.attendedEventsByUserId);

      setEvents(data.attendedEventsByUserId);
    }
  }, [data]);

  return (
    <div>
      <h1 className="text-xl font-bold text-center ">
        Events you plan on attending
      </h1>

      {loading ? (
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
      ) : (
        <div
          className="bg-accent flex justify-center items-center flex-col text-center mx-5"
          style={{
            marginTop: '2rem',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '1rem',
          }}
        >
          {events.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-base-100 p-10 rounded-box ">
              <p>You have not planned to atttend any events</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AttendingPage;
