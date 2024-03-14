import {ChangeEvent, FormEvent, useState, useEffect} from 'react';
import {useMutation} from '@apollo/client';
import {addEvent} from '../src/graphql/eventQueries';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {getCategories} from '../src/graphql/categoryQueries';
import {EventType} from '../src/types/EventType';
import {Category} from '../src/types/Category';
import {useNavigate} from 'react-router-dom';

function CreateEventForm() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token') || undefined;
  const [categories, setCategories] = useState<Category[]>([]);
  //initial state for event
  const [event, setEvent] = useState<Partial<EventType>>({
    event_name: '',
    description: '',
    date: '',
    email: '',
    organizer: '',
    address: '',
    age_restriction: '',
    event_site: '',
    ticket_site: '',
    price: '',
    image: '',
    category: [],
  });
  //category replacements to make the category names more user friendly
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

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await doGraphQLFetch(API_URL, getCategories, {}, token);
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  //create event mutation
  const [createEvent] = useMutation(addEvent, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    },
    onCompleted: (data) => {
      setEvent({
        event_name: '',
        description: '',
        date: '',
        email: '',
        organizer: '',
        address: '',
        age_restriction: '',
        event_site: '',
        ticket_site: '',
        price: '',
        image: '',
        category: [],
      });
      navigate(`/event/${data.createEvent.id}`);
    },
    onError: (error) => {
      console.error('Error creating event: ', error);
      alert('Error creating event');
    },
  });

  //handle change for input fields
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        category: [...(prevEvent.category || []), event.target.value],
      }));
    } else {
      setEvent((prevEvent) => ({
        ...prevEvent,
        category: (prevEvent.category || []).filter(
          (id) => id !== event.target.value,
        ),
      }));
    }
  };

  //create event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {data} = await createEvent({variables: {input: event}});
    console.log('data:', data);
  };

  return (
    <div
      style={{
        paddingBottom: '3rem',
        paddingRight: '3rem',
        paddingLeft: '3rem',
      }}
    >
      <h1 className="text-5xl font-bold text-center">Create Event</h1>
      <div className="bg-accent p-10 mt-5 rounded-lg">
        <div>
          <div
            className="bg-base-100 rounded-lg text-center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <div>
              <h2 className="text-xl font-bold">Event Details</h2>
              <div
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Event Name*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="event_name"
                      value={event.event_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Description*</label>
                    <textarea
                      className="input input-bordered w-full mt-3"
                      name="description"
                      value={event.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Date*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="date"
                      name="date"
                      value={event.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Email*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="email"
                      name="email"
                      value={event.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Organizer*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="organizer"
                      value={event.organizer}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Address*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="address"
                      value={event.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Age Restriction*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="age_restriction"
                      value={event.age_restriction}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Event Site</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="event_site"
                      value={event.event_site}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Ticket Site</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="ticket_site"
                      value={event.ticket_site}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '1rem',
                    }}
                  >
                    <label>Price*</label>
                    <input
                      className="input input-bordered w-1/3 mt-3"
                      type="text"
                      name="price"
                      value={event.price}
                      onChange={handleChange}
                    />
                  </div>
                  <fieldset>
                    <legend>Categories</legend>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      {categories.map((category) => {
                        const categoryName =
                          categoryReplacements[
                            category.category_name.toLowerCase()
                          ] || category.category_name;
                        return (
                          <label
                            key={category.id}
                            style={{
                              margin: '1rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              name="category"
                              value={category.id}
                              onChange={handleCategoryChange}
                            />
                            {categoryName}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  <button type="submit" className="btn btn-primary mt-5">
                    Create Event
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEventForm;
