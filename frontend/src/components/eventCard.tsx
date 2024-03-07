import React from 'react';

const EventCard: React.FC = () => {
  const event = {
    name: 'Event 1',
    description: 'Älä välitä tästä kuvasta vielä lol',
    image: 'https://picsum.photos/400/250',
  };

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <img src={event.image} alt={event.name} />
    </div>
  );
};

export default EventCard;
