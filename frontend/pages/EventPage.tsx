import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getEventById} from '../src/graphql/eventQueries';
import {useMutation, useQuery} from '@apollo/client';
import {toggleFavoriteEvent} from '../src/graphql/queries';

interface EventPageParams {
  id: string;
  [key: string]: string | undefined;
}

const EventPage: React.FC = () => {
  const {eventId} = useParams<EventPageParams>();
  const token = localStorage.getItem('token');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorite, setFavorite] = useState(false);

  console.log('token', token);
  //get event data
  const {
    loading,
    error,
    data: eventData,
  } = useQuery(getEventById, {
    variables: {id: eventId},
  });

  //toggle favorite
  const [toggleFavorite, {data: favoriteData}] =
    useMutation(toggleFavoriteEvent);

  const handleToggleFavoriteEvent = async () => {
    // Call the mutate function to execute the mutation
    if (!token) {
      alert('You must be logged in to favorite an event');
      return;
    }
    if (!eventId) {
      console.log('no eventId');
      return;
    }
    const favorite = await toggleFavorite({
      variables: {eventId: eventId},
    });
    if (favorite) {
      console.log('favorite', favorite.data.toggleFavoriteEvent.isTrue);
      setIsFavorite(favorite.data.toggleFavoriteEvent.isTrue);
      setFavorite(favorite.data.toggleFavoriteEvent.isTrue);
    }
  };

  const event = useMemo(() => {
    console.log('data', eventData);
    console.log('eventId', eventId);
    if (eventData && eventData.event) {
      console.log('data.event', eventData.event);
      return eventData.event;
    }
    return undefined;
  }, [eventData]);

  useEffect(() => {
    console.log('isFavorite', isFavorite);
    if (event) {
      setIsFavorite(favorite);
    }
  }, [favorite]);

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
    <div>
      <div
        className="card lg:card-side bg-base-100 shadow-xl"
        style={{width: '60%', margin: 'auto'}}
      >
        <figure>
          {event?.image && event?.image.length > 5 && (
            <img src={event?.image} alt="picture" />
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
              <button className="btn">
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
              <p>Likes: {event.favoriteCount}</p>
              <p>Attending: {event.attendeeCount}</p>
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
