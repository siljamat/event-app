/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {
  getEventsByAddress,
  getEventsByCategory,
  getEventsByDate,
  getEventsByMinAge,
} from '../src/graphql/eventQueries';
import {getCategories} from '../src/graphql/categoryQueries';
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
    category: '',
  });

  const [searchPerformed, setSearchPerformed] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [displayCategories, setDisplayCategories] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEvents = async () => {
    setSearchPerformed(true);
    let fetchedEvents: EventType[] = [];

    if (searchParams.date) {
      const data = await doGraphQLFetch(API_URL, getEventsByDate, {
        date: searchParams.date,
      });
      fetchedEvents = fetchedEvents.concat(data.eventsByDate || []);
    }

    if (searchParams.age) {
      const data = await doGraphQLFetch(API_URL, getEventsByMinAge, {
        age: searchParams.age,
      });
      fetchedEvents = fetchedEvents.concat(data.eventsByMinAge || []);
    }

    console.log('searchParamAdress: ', searchParams.address);

    if (searchParams.address) {
      const data = await doGraphQLFetch(API_URL, getEventsByAddress, {
        address: searchParams.address,
      });
      fetchedEvents = fetchedEvents.concat(data.eventsByAddress || []);
    }
    if (searchParams.category) {
      const data = await doGraphQLFetch(API_URL, getEventsByCategory, {
        category: searchParams.category,
      });
      fetchedEvents = fetchedEvents.concat(data.eventsByCategory || []);
    }

    setEvents(fetchedEvents);
  };

  console.log('searchParams', searchParams.category);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSearchParams({
      ...searchParams,
      [event.target.name]: event.target.value,
    });
  };

  const combinedEvents = events
    .concat(apiEvents)
    .filter((event) => event !== null && event !== undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await doGraphQLFetch(API_URL, getCategories, {});
      const categoryReplacements: {[key: string]: string} = {
        concert: 'Concerts',
        theatre: 'Theatre',
        liikuntalaji: 'Sports',
        'food & drink': 'Food & Drink',
        outdoors: 'Outdoors',
        community: 'Community',
        workshops: 'Workshops',
        charity: 'Charity',
        children: 'Kids',
      };
      setCategories(
        data.categories.map(
          (category: {category_name: string}) => category.category_name,
        ),
      );
      setDisplayCategories(
        data.categories.map(
          (category: {category_name: string}) =>
            categoryReplacements[category.category_name] ||
            category.category_name,
        ),
      );
    };

    fetchCategories();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const displayValue = event.target.value;
    const actualValue = categories[displayCategories.indexOf(displayValue)];
    setSearchParams({
      ...searchParams,
      [event.target.name]: actualValue,
    });
  };

  return (
    <div>
      <select
        name="category"
        value={displayCategories[categories.indexOf(searchParams.category)]}
        onChange={handleSelectChange}
      >
        <option value="">Select a category</option>
        {displayCategories.map((category, index) => (
          <option key={categories[index]} value={category}>
            {category}
          </option>
        ))}
      </select>
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
        name="free search"
        value={searchParams.keyword}
        onChange={handleInputChange}
        placeholder="Free search"
      />
      <input
        type="number"
        name="age"
        value={searchParams.age}
        onChange={handleInputChange}
        placeholder="Age"
      />
      <button onClick={fetchEvents}>Search</button>
      {searchPerformed &&
        (combinedEvents.length > 0 ? (
          combinedEvents.slice(0, 10).map((event) => {
            console.log(event.date);
            return (
              <div key={event.id}>
                <EventCard event={event} />
              </div>
            );
          })
        ) : (
          <p>No events</p>
        ))}
    </div>
  );
};

export default SearchPage;

//TODO: ikähaku ja address pois
//free haku
//category alasvetovalikko
