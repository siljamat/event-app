import {useEffect, useState} from 'react';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {getEventsByDate} from '../src/graphql/eventQueries';
import EventCard from '../src/components/EventCard';
import {EventType} from '../src/types/EventType';

const EventsPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const data = await doGraphQLFetch(API_URL, getEventsByDate, {
        date: today,
      });
      setEvents(data.eventsByDate);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {isLoading ? (
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
        <>
          <h1 className="text-2xl text-center">Today's events</h1>
          <div
            style={{
              marginRight: '50px',
              marginLeft: '50px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
            }}
          >
            {events.slice(0, 10).map((event) => {
              console.log(event.date); // Log the date of the event
              return (
                <div key={event.id}>
                  <EventCard event={event} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsPage;
