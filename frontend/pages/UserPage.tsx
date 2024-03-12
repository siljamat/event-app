/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useContext, useState} from 'react';
//import {doGraphQLFetch} from '../src/graphql/fetch';
//import {getUserEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {AuthContext} from '../src/context/AuthContext';
import EventCard from '../src/components/EventCard';
import {useQuery} from '@apollo/client';
import {getUser} from '../src/graphql/userQueries';

const UserPage: React.FC = () => {
  const storedUserData = localStorage.getItem('user');
  const storedUser = JSON.parse(storedUserData as string);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const [eventData, setEvents] = React.useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);

  //Tästä saadaan tietokannasta käyttäjän tiedot
  const {
    loading,
    error,
    data: userData,
  } = useQuery(getUser, {
    variables: {id: storedUser.id},
  });

  console.log('userData', userData);

  useEffect(() => {
    if (!storedUserData) {
      console.log('no user');
      return;
    }
    console.log('fetching data');
    console.log('isAuthenticated', isAuthenticated);
  }, [API_URL, isAuthenticated, storedUserData]);

  return (
    <div>
      <h1>UserPage</h1>
      <h2>On tämäkin työmaaaaaa</h2>
      {isAuthenticated ? (
        eventData.map((event, index) => <EventCard key={index} event={event} />)
      ) : (
        <p>Please log in to see your events.</p>
      )}
    </div>
  );
};
export default UserPage;
