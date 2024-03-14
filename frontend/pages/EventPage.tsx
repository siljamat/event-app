import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getEventById} from '../src/graphql/eventQueries';
import {useMutation, useQuery} from '@apollo/client';
import {
  attendingEvents,
  likedEvents,
  toggleAttendingEvent,
  toggleFavoriteEvent,
} from '../src/graphql/queries';
import {EventType} from '../src/types/EventType';
import {Category} from '../src/types/Category';

const EventPage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const token = localStorage.getItem('token');
  const storedUserData = localStorage.getItem('user');
  const user = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = user?.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [categories, setCategories] = useState([]);

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

  //query liked events and set isFavorite if user found on the event's liked list
  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  useEffect(() => {
    console.log('likedData', likedData);
    if (likedData && likedData.favoritedEventsByUserId) {
      const likedEventsData = likedData.favoritedEventsByUserId;
      const isFav = likedEventsData.some((event: EventType) => event.id === id);
      setIsFavorite(isFav);
    }
  }, [likedData]);

  //query attending events and set isAttending if user found on the event's attending list
  const {data} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });
  useEffect(() => {
    // Set liked events data
    if (data && data.attendedEventsByUserId) {
      const attendedEventsData = data.attendedEventsByUserId;
      const isAtt = attendedEventsData.some(
        (event: EventType) => event.id === id,
      );
      setIsAttending(isAtt);
    }
  }, [data]);

  //get event data
  const {
    loading,
    error,
    data: eventData,
  } = useQuery(getEventById, {
    variables: {id: id},
  });

  //memoize event data
  const event = useMemo(() => {
    if (eventData && eventData.event) {
      console.log('eventData', eventData);
      return eventData.event;
    }
    return undefined;
  }, [eventData]);

  //set categories
  useEffect(() => {
    if (eventData && eventData.event && eventData.event.category) {
      setCategories(eventData.event.category);
      console.log('categories', categories);
    }
  }, [eventData]);

  //toggle favorite and attending
  const [toggleFavorite] = useMutation(toggleFavoriteEvent);
  const [toggleAttending] = useMutation(toggleAttendingEvent);
  const handleToggleFavoriteEvent = async () => {
    if (!token) {
      alert('You must be logged in to favorite an event');
      return;
    }
    if (!id) {
      console.log('no eventId');
      return;
    }
    if (event && event.creator.user_name === 'apiUser') {
      alert('Can not favorite api events :(((');
      return;
    }
    const favorite = await toggleFavorite({
      variables: {eventId: id},
    });
    if (favorite) {
      console.log('favorite', favorite.data.toggleFavoriteEvent.isTrue);
      setIsFavorite(favorite.data.toggleFavoriteEvent.isTrue);
      window.location.reload();
    }
  };

  const handleToggleAttendingEvent = async () => {
    if (!token) {
      alert('You must be logged in to attend an event');
      return;
    }
    if (event && event.creator.user_name === 'apiUser') {
      alert('Can not attend api events (yet) :(((');
      return;
    }
    const attend = await toggleAttending({
      variables: {eventId: id},
    });
    if (attend) {
      console.log('attend', attend.data.toggleAttendingEvent.isTrue);
      setIsAttending(attend.data.toggleAttendingEvent.isTrue);
    }

    console.error(error);
  };

  //render spinner while loading and error message if error
  if (loading) {
    return (
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
    );
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div className="p-10">
      <div
        className="card lg:card-side bg-base-100 shadow-xl"
        style={{width: '60%', margin: 'auto'}}
      >
        <figure>
          {event.image && event.image.length > 5 ? (
            <img src={event.image} />
          ) : (
            <img src="https://picsum.photos/200/300" />
          )}
        </figure>
        <div className="card-body">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h2 className="card-title">{event.event_name}</h2>
            <div className="flex flex-row">
              <button
                className="btn"
                style={{marginRight: '5px'}}
                onClick={handleToggleFavoriteEvent}
              >
                {isFavorite ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </button>
              <button className="btn" onClick={handleToggleAttendingEvent}>
                {isAttending ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7" // This is a checkmark icon, replace with your own if needed
                      />
                    </svg>
                    Attending
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Attend
                  </>
                )}
              </button>
            </div>
          </div>
          <p>{new Date(event.date).toLocaleDateString()}</p>{' '}
          {event.address !== 'No address' && <p>{event.address}</p>}
          <p dangerouslySetInnerHTML={{__html: event.description}} />
          {event.age_restriction && (
            <p>Age restriction: {event.age_restriction}</p>
          )}
          {event.price && <p>Price: {event.price}</p>}
          {event.email && <p>Email: {event.email}</p>}
          {event.site && <p>Site: {event.site}</p>}
          <div
            className="card-actions justify-end"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <div>
              <div className="flex flex-row">
                {categories.map((category: Category, index: number) => {
                  const categoryName =
                    categoryReplacements[
                      category.category_name.toLowerCase()
                    ] || category.category_name;
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
            </div>
            <div className="flex flex-row">
              <div id="x-btn">
                <a
                  href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                  className="twitter-share-button flex items-center btn btn-ghost btn-sm"
                  style={{marginRight: '5px'}}
                  data-show-count="false"
                >
                  <span className="[&>svg]:h-3 [&>svg]:w-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                      style={{width: '20px', height: '20px'}}
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                  </span>
                  Post
                </a>
                <script
                  async
                  src="https://platform.twitter.com/widgets.js"
                ></script>
                <div id="fb-root"></div>
                <script
                  async
                  defer
                  crossOrigin="anonymous"
                  src="https://connect.facebook.net/fi_FI/sdk.js#xfbml=1&version=v19.0"
                  nonce="yqNJsLdP"
                ></script>
              </div>
              <div
                className="fb-share-button"
                data-href="https://developers.facebook.com/docs/plugins/"
                data-layout=""
                data-size=""
              >
                <a
                  target="_blank"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
                  className="fb-xfbml-parse-ignore btn btn-ghost btn-sm"
                >
                  <span className="[&>svg]:h-5 [&>svg]:w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                      style={{width: '20px', height: '20px'}}
                    >
                      <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                    </svg>
                  </span>
                  Share
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
