import {EventType} from '../types/EventType';

function EventCard({event}: {event: EventType}) {
  const shortDescription = event.description.substring(0, 200);

  return (
    <>
      <div className="card w-70 bg-base-100 shadow-xl mt-5 ">
        <figure>
          {event.image && event.image.length > 5 && <img src={event.image} />}
        </figure>{' '}
        <div className="card-body">
          <h2 className="card-title">{event.event_name}</h2>
          <p>{event.date}</p>
          <p>{event.address}</p>
          <p dangerouslySetInnerHTML={{__html: shortDescription}} />
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
            {event.attendeeCount > 0 && (
              <p className="flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-5 mt-1 mr-1"
                >
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                </svg>
                : {event.attendeeCount}
              </p>
            )}
          </div>
          <div>
            <div className="flex flex-row">
              {event.category.map((category, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg "
                  style={{
                    marginRight: '5px',
                    padding: '5px',
                  }}
                >
                  {category.category_name}
                </div>
              ))}
            </div>
          </div>
          <div className="card-actions justify-end">
            <a className="link" href={`/event/${event.id}`}>
              More...
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default EventCard;
