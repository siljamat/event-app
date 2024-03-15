/* eslint-disable @typescript-eslint/no-explicit-any */
import {useMutation, useQuery} from '@apollo/client';
import {getUserEvents} from '../graphql/queries';
import {useEffect, useState} from 'react';
import EditEventModal from './editEventModal';
import {EventType} from '../types/EventType';
import {deleteEvent} from '../graphql/eventQueries';

/**
 * UserEvents component displays the events of the user.
 * @returns {JSX.Element} The rendered UserEvents component.
 */
const UserEvents = () => {
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEventHandle] = useMutation(deleteEvent);

  // Replace category names with more user friendly ones
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

  const {loading, data} = useQuery(getUserEvents, {
    variables: {userId},
    skip: !userId,
  });

  // Set events to state
  useEffect(() => {
    if (data) {
      setEvents(data.createdEventsByUserId);
    }
  }, [data]);

  /**
   * Function to open the modal with event data.
   * @param {any} event - The event data.
   */
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    console.log('Edit event:', event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Function to delete an event.
   * @param {any} event - The event data.
   */
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

  return (
    <div>
      <EditEventModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        event={selectedEvent as unknown as EventType}
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
        <div>
          <h1 className="text-2xl text-center mb-5">Your events</h1>

          <div
            className="bg-accent mx-5"
            style={{
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '1rem',
            }}
          >
            {events.length === 0 ? (
              <div className="bg-base-100 p-10 rounded-box ">
                <p className="text-l mb-3">No events created</p>
                <a className="btn btn-primary mt-5" href={`/createEvent`}>
                  Create event
                </a>
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
                        {event.address !== 'No address' && (
                          <p>{event.address}</p>
                        )}
                        <p
                          dangerouslySetInnerHTML={{__html: event.description}}
                        />
                        {event.age_restriction && (
                          <p>Age restriction: {event.age_restriction}</p>
                        )}
                        {event.price && <p>Price: {event.price}</p>}
                        {event.email && <p>Email: {event.email}</p>}
                        {event.event_site && <p>Site: {event.event_site}</p>}
                        <div>
                          <div className="">
                            <div className="flex flex-row mb-5">
                              {event.category.map((category, index: number) => {
                                const categoryName =
                                  categoryReplacements[
                                    (
                                      category as unknown as {
                                        category_name: string;
                                      }
                                    ).category_name.toLowerCase()
                                  ] || (category as string);
                                return (
                                  <div
                                    key={index}
                                    className="border rounded-lg "
                                    style={{
                                      marginRight: '5px',
                                      padding: '5px',
                                    }}
                                  >
                                    {categoryName}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="card-actions justify-between">
                              <div>
                                <p className="flex flex-row">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 pr-1 mt-1"
                                  >
                                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                                  </svg>
                                  : {event.favoriteCount}
                                </p>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEvents;
