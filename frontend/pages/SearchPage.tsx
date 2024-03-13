/* eslint-disable @typescript-eslint/no-explicit-any */
import {useLazyQuery} from '@apollo/client';
import React from 'react';
import {useState} from 'react';
import {
  getEventsByAddress,
  getEventsByDate,
  getEventsByMinAge,
} from '../src/graphql/eventQueries';
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

  const [
    executeSearchByAddress,
    {loading: loadingByAddress, error: errorByAddress, data: dataByAddress},
  ] = useLazyQuery(getEventsByAddress);

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
    console.log('searchTerms.date before if:', searchTerms.date);
    if (searchTerms.date) {
      console.log('searchTerms.date:', searchTerms.date);
      const date = new Date(searchTerms.date);
      console.log('Parsed date:', date);
      console.log('Sending date:', date.toISOString());
      executeSearchByDate({variables: {date: date.toISOString()}});
    }
    if (searchTerms.address) {
      executeSearchByAddress({variables: {address: searchTerms.address}});
    }
  };

  if (loadingByAge || loadingByDate || loadingByAddress)
    return <p>Loading...</p>;
  if (errorByAge || errorByDate || errorByAddress) return <p>Error</p>;
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
      {dataByAddress && (
        <div>
          {dataByAddress.eventsByAddress.map((event: any, index: number) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
