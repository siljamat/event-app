import {useMutation, useQuery} from '@apollo/client';
import {getUserEvents} from '../graphql/queries';
import {useEffect, useState} from 'react';
import EditEventModal from './editEventModal';
import {EventType} from '../types/EventType';
import {deleteEvent} from '../graphql/eventQueries';

const UserEvents = () => {
  const token = localStorage.getItem('token');
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEventHandle] = useMutation(deleteEvent);

  console.log('token', token);
  console.log('user', userId);

  const {loading, error, data} = useQuery(getUserEvents, {
    variables: {userId},
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      console.log('data', data.createdEventsByUserId);
      setEvents(data.createdEventsByUserId);
    }
  }, [data]);

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    console.log('Edit event:', event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (event: any) => {
    console.log('Delete event');
    console.log('eventId', event.id);
    const response = await deleteEventHandle({
      variables: {
        deleteEventId: event.id,
      },
    });
    console.log('response', response);
    if (response.data.deleteEvent.success) {
      alert('Event deleted');
      window.location.reload();
    }
  };

  const handleCreateEvent = () => {
    window.location.href = '/createEvent';
  };

  return (
    <div>
      <EditEventModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        event={selectedEvent}
      />
      {loading ? (
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
        <div
          className="bg-accent flex justify-center items-center flex-col text-center mx-5"
          style={{
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h1 className="text-2xl font-bold mb-5">Your events</h1>
          {events.length === 0 ? (
            <div className="bg-base-100 p-10 rounded-box ">
              <p className="text-l mb-3">No events created</p>
              <button className="btn btn-primary" onClick={handleCreateEvent}>
                Create event
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {events.map((event: EventType) => (
                <div key={event.id}>
                  <div className="card w-80 bg-base-100 shadow-xl mt-5 ">
                    <figure>
                      {event?.image && event?.image.length > 5 && (
                        <img src={event?.image} alt="picture" />
                      )}
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{event.event_name}</h2>
                      <p>{new Date(event.date).toLocaleDateString()}</p>{' '}
                      {event.address !== 'No address' && <p>{event.address}</p>}
                      <p
                        dangerouslySetInnerHTML={{__html: event.description}}
                      />
                      {event.age_restriction && (
                        <p>Age restriction: {event.age_restriction}</p>
                      )}
                      {event.price && <p>Price: {event.price}</p>}
                      {event.email && <p>Email: {event.email}</p>}
                      {event.event_site && <p>Site: {event.event_site}</p>}
                      <div className="card-actions justify-between">
                        <div>
                          <p>Likes: {event.favoriteCount}</p>
                          <p>Attending: {event.attendeeCount}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="btn mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
