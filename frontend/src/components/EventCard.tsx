import React from 'react';

//TODO: Hae oikean eventin tiedot
const EventCard: React.FC = () => {
  const event = {
    name: 'Event 1',
    description: 'Älä välitä tästä kuvasta vielä lol',
    image: 'https://picsum.photos/400/250',
  };

  return (
    <div className="w-1/4">
      <div className="card-body rounded bg-base-100 shadow-md">
        <img
          src={event.image}
          alt={event.name}
          className="w-full rounded-t-md"
        />
        <h2 className="font-bold text-md text-center">{event.name}</h2>
        <p className="text-center">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
