/* eslint-disable @typescript-eslint/no-explicit-any */
import {useLazyQuery} from '@apollo/client';
import React from 'react';
import {useState} from 'react';
import {getEventsByDate, getEventsByMinAge} from '../src/graphql/eventQueries';
import EventCard from '../src/components/EventCard';

function SearchPage() {
  const [searchTerms, setSearchTerms] = useState({
    keyword: '',
    date: '',
    age: '',
    address: '',
    category: '',
  });

  const [
    executeSearchByAge,
    {loading: loadingByAge, error: errorByAge, data: dataByAge},
  ] = useLazyQuery(getEventsByMinAge);

  const [
    executeSearchByDate,
    {loading: loadingByDate, error: errorByDate, data: dataByDate},
  ] = useLazyQuery(getEventsByDate);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms({
      ...searchTerms,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerms.age) {
      executeSearchByAge({variables: {age: searchTerms.age}});
    }
    if (searchTerms.date) {
      executeSearchByDate({variables: {date: searchTerms.date}});
    }
  };

  if (loadingByAge || loadingByDate) return <p>Loading...</p>; // check both loading states
  if (errorByAge || errorByDate) return <p>Error</p>; // check both error states

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="keyword"
          value={searchTerms.keyword}
          onChange={handleChange}
          placeholder="Keyword"
        />
        <input
          type="date"
          name="date"
          value={searchTerms.date}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          value={searchTerms.age}
          onChange={handleChange}
          placeholder="Age"
        />
        <input
          type="text"
          name="address"
          value={searchTerms.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">Search</button>
      </form>
      {dataByAge && (
        <div>
          {dataByAge.eventsByMinAge.map((event: any, index: number) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      )}
      {dataByDate && (
        <div>
          {dataByDate.eventsByDate.map((event: any, index: number) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
