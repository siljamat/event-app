/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {getEventsByDate} from '../src/graphql/eventQueries';
import EventCard from '../src/components/EventCard';
import {EventType} from '../src/types/EventType';

const SearchPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [apiEvents, setApiEvents] = useState<EventType[]>([]);
  const [searchParams, setSearchParams] = useState({
    date: '',
    address: '',
    keyword: '',
    age: '',
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (searchParams.date) {
      const fetchEvents = async () => {
        const data = await doGraphQLFetch(API_URL, getEventsByDate, {
          date: searchParams.date,
        });
        setEvents(data.eventsByDate);
      };

      fetchEvents();
    }
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <input
        type="date"
        name="date"
        value={searchParams.date}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="address"
        value={searchParams.address}
        onChange={handleInputChange}
        placeholder="Address"
      />
      <input
        type="text"
        name="keyword"
        value={searchParams.keyword}
        onChange={handleInputChange}
        placeholder="Keyword"
      />
      <input
        type="number"
        name="age"
        value={searchParams.age}
        onChange={handleInputChange}
        placeholder="Age"
      />
      {events
        .concat(apiEvents)
        .slice(0, 10)
        .map((event) => {
          console.log(event.date);
          return (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          );
        })}
    </div>
  );
};

export default SearchPage;
