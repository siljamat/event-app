import React from 'react';
import {useState} from 'react';

function SearchPage() {
  const [searchTerms, setSearchTerms] = useState({
    keyword: '',
    date: '',
    age: '',
    address: '',
  });

  const handleChange = (event) => {
    setSearchTerms({
      ...searchTerms,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    // Replace this with your actual search logic
    console.log('Performing search with the following terms:', searchTerms);
  };

  return (
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
  );
}

export default SearchPage;
