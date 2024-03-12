import React, {useMemo} from 'react';
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
  const {
    loading,
    error,
    data: eventData,
  } = useQuery(getEventById, {
    variables: {id: eventId},
  });

  const [handleToggleFavoriteEvent, {data: toggleFavoriteEventData}] =
    useMutation(toggleFavoriteEvent, {
      context: {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });
  console.log('toggleFavoriteEventData', toggleFavoriteEventData);

  const event = useMemo(() => {
    console.log('data', eventData);
    if (eventData && eventData.event) {
      console.log('data.event', eventData.event);
      return eventData.event;
    }
    return undefined;
  }, [eventData]);

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

  //TODO: Add a loading spinner
  //add share button
  //add like button
  //add attending button
  //show attending count
  //show like count
  return (
    <div>
      <div
        className="card lg:card-side bg-base-100 shadow-xl"
        style={{width: '60%', margin: 'auto'}}
      >
        {' '}
        <figure>
          <img src={event?.image} alt="picture" />
        </figure>
        <div className="card-body">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 className="card-title">{event.event_name}</h2>
            <div>
              <button
                className="btn "
                style={{marginRight: '10px'}}
                onClick={() =>
                  handleToggleFavoriteEvent({variables: {eventId: event.id}})
                }
              >
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
                Like
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
          <div className="card-actions justify-end">
            <div id="x-btn">
              <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button flex items-center btn btn-primary"
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
                className="fb-xfbml-parse-ignore btn btn-primary"
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
  );
};

export default EventPage;
