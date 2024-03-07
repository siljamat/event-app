import React from 'react';
import EventCard from '../src/components/eventCard';

// Määrittele komponentti, joka vastaa etusivua
const Home: React.FC = () => {
  // Klikkaamalla tätä nappia käyttäjä ohjataan sivulle, jolla on kartta
  const handleGoToMapPage = () => {
    // Voit käyttää React Routeria navigointiin tai ohjata käyttäjän suoraan
    // Voit käyttää myös Link-komponenttia, jos käytät React Routeria
    window.location.href = '/LocMap'; // Korvaa '/map' oikealla polulla
  };

  return (
    <div>
      <h1>FrontPage</h1>
      <EventCard />
      <button onClick={handleGoToMapPage}>To map page</button>
    </div>
  );
};

export default Home;
