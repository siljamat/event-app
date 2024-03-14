/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {
  getEventsByCategory,
  getEventsByDate,
  getEventsByTitle,
} from '../src/graphql/eventQueries';
import {getCategories} from '../src/graphql/categoryQueries';
import EventCard from '../src/components/EventCard';
import {EventType} from '../src/types/EventType';
import {useMediaQuery} from 'react-responsive';

const SearchPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [apiEvents] = useState<EventType[]>([]);
  const [searchParams, setSearchParams] = useState({
    date: '',
    keyword: '',
    category: '',
  });

  const [searchPerformed, setSearchPerformed] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [displayCategories, setDisplayCategories] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const isMobile = useMediaQuery({query: '(max-width: 650px)'});

  // Fetch categories from the API and set category names
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

  // Fetch events from the API
  const fetchEvents = async () => {
    setSearchPerformed(true);

    let fetchedEvents: EventType[] = [];

    if (searchParams.date) {
      const data = await doGraphQLFetch(API_URL, getEventsByDate, {
        date: searchParams.date,
      });
      fetchedEvents = fetchedEvents.concat(data.eventsByDate || []);
    }

    if (searchParams.category) {
      const data = await doGraphQLFetch(API_URL, getEventsByCategory, {
        categoryName: searchParams.category,
      });
      if (data && data.eventsByCategory) {
        fetchedEvents = fetchedEvents.concat(
          data.eventsByCategory.filter((event: EventType) => event !== null),
        );
      } else {
        console.error('eventsByCategory is undefined');
      }
    }

    if (searchParams.keyword) {
      const data = await doGraphQLFetch(API_URL, getEventsByTitle, {
        keyword: searchParams.keyword,
      });
      if (data && data.eventsByTitle) {
        fetchedEvents = fetchedEvents.concat(
          data.eventsByTitle.filter((event: EventType) => event !== null),
        );
      } else {
        console.error('eventsByTitle is undefined');
      }
    }

    setEvents(fetchedEvents);
  };

  // Handle input change
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSearchParams({
      ...searchParams,
      [event.target.name]: event.target.value,
    });
  };

  // Handle select change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const displayValue = event.target.value;
    const actualValue = categories[displayCategories.indexOf(displayValue)];
    setSearchParams({
      ...searchParams,
      [event.target.name]: actualValue,
    });
  };

  // Combine database events and API events
  const combinedEvents = events
    .concat(apiEvents)
    .filter((event) => event !== null && event !== undefined);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div
      style={{
        paddingBottom: '3rem',
        paddingRight: '3rem',
        paddingLeft: '3rem',
      }}
    >
      <h1 className="text-2xl  text-center mb-5">Search events</h1>
      <div className="bg-accent p-10 mt-2 rounded-lg">
        <div>
          <div
            className="bg-base-100 rounded-lg text-center"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '15px',
            }}
          >
            <div>
              <div
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#4792AB',
                      padding: '8px',
                      borderRadius: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <p className="">
                      You can only use one way of searching, if you try to
                      search by date and category there will not any results
                    </p>
                  </div>
                  <label>Category</label>
                  <select
                    className="select border rounded-lg w-1/3 mt-2"
                    style={{padding: '0.5rem'}}
                    name="category"
                    value={
                      displayCategories[
                        categories.indexOf(searchParams.category)
                      ]
                    }
                    onChange={handleSelectChange}
                  >
                    <option value="">Select a category</option>
                    {displayCategories.map((category, index) => (
                      <option key={categories[index]} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '2px',
                  }}
                >
                  <label>Date</label>
                  <input
                    className="input input-bordered w-1/3 mt-2"
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '2px',
                  }}
                >
                  <label>Keyword</label>
                  <input
                    className="input input-bordered w-1/3 mt-2"
                    type="text"
                    name="keyword"
                    value={searchParams.keyword}
                    onChange={handleInputChange}
                    placeholder="Free search"
                  />
                </div>
                <button className="btn btn-primary mt-3" onClick={fetchEvents}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchPerformed && combinedEvents.length > 0 ? (
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
          {combinedEvents.slice(0, 10).map((event) => {
            console.log(event.date);
            return (
              <div key={event.id}>
                <EventCard event={event} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className=" p-10">
          <p className="text text-center text-xl">No events</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
