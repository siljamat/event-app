import {EventType} from '../types/EventType';

function EventCard({event}: {event: EventType}) {
  const shortDescription = event.description.substring(0, 200);

  return (
    <>
      <div className="card w-80 bg-base-100 shadow-xl mt-5 ">
        <figure>
          <img src={event.image}></img>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{event.event_name}</h2>
          <p>{event.date}</p>
          <p>{event.address}</p>
          <p dangerouslySetInnerHTML={{__html: shortDescription}} />
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
