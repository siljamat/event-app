/* eslint-disable @typescript-eslint/no-explicit-any */
import {useLazyQuery} from '@apollo/client';
import React from 'react';
import {useState} from 'react';
import {getEventsByMinAge} from '../src/graphql/eventQueries';
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms({
      ...searchTerms,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeSearchByAge({variables: {age: searchTerms.age}});
  };

  if (loadingByAge) return <p>Loading...</p>;
  if (errorByAge) return <p>Error</p>;

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
    </div>
  );
}

export default SearchPage;
