import React, {useEffect} from 'react';
import {EventType} from '../src/types/EventType';
import {likedEvents} from '../src/graphql/queries';
import {useQuery} from '@apollo/client';
import EventCard from '../src/components/EventCard';

/**
 * LikedEventsPage component fetches and displays all liked events.
 * @returns {JSX.Element} The rendered LikedEventsPage component.
 */
const LikedEventsPage = () => {
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;

  /**
   * @type {React.State<EventType[]>} likedEventsData - The state variable where the liked events are stored.
   * @function setLikedEventsData - The function to update the likedEventsData state.
   */
  const [likedEventsData, setLikedEventsData] = React.useState<EventType[]>([]);

  /**
   * @type {object} likedData - The data returned from the likedEvents query.
   */
  const {data: likedData, loading} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  // Set liked events data when likedData changes
  useEffect(() => {
    console.log('likedData', likedData);
    if (likedData && likedData.favoritedEventsByUserId) {
      setLikedEventsData(likedData.favoritedEventsByUserId);
    }
  }, [likedData]);

  return (
    <div>
      <h1 className="text-xl font-bold text-center ">Liked Events</h1>

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
            marginTop: '2rem',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '1rem',
          }}
        >
          {likedEventsData.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {' '}
              {likedEventsData.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-base-100 p-10 rounded-box ">
              <p>No liked events</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedEventsPage;
