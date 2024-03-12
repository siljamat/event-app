import {ChangeEvent, FormEvent, useState} from 'react';
import {useMutation} from '@apollo/client';
import {addEvent} from '../src/graphql/eventQueries';

function CreateEventForm() {
  const token = localStorage.getItem('token');
  const [event, setEvent] = useState({
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
  });

  const [createEvent] = useMutation(addEvent, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {data} = await createEvent({variables: {input: event}});
    console.log('data:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <label className="flex flex-col">
        Event Name:
        <input
          type="text"
          name="event_name"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Description:
        <textarea name="description" onChange={handleChange} className="mt-1" />
      </label>
      <label className="flex flex-col">
        Date:
        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Email:
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Organizer:
        <input
          type="text"
          name="organizer"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Address:
        <input
          type="text"
          name="address"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Age Restriction:
        <input
          type="text"
          name="age_restriction"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Event Site:
        <input
          type="text"
          name="event_site"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Ticket Site:
        <input
          type="text"
          name="ticket_site"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Price:
        <input
          type="text"
          name="price"
          onChange={handleChange}
          className="mt-1"
        />
      </label>
      <label className="flex flex-col">
        Image:
        <input
          type="text"
          name="image"
          onChange={handleChange}
          className="mt-1"
        />
      </label>

      <button type="submit" className="mt-4">
        Create Event
      </button>
    </form>
  );
}

export default CreateEventForm;
