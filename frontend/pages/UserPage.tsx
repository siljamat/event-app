/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useContext} from 'react';
//import {doGraphQLFetch} from '../src/graphql/fetch';
import {getUserEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import {AuthContext} from '../src/context/AuthContext';
import EventCard from '../src/components/EventCard';
import {useQuery} from '@apollo/client';

const UserPage: React.FC = () => {
  const storedUserData = localStorage.getItem('user');
  const storedUser = JSON.parse(storedUserData as string);
  const token = localStorage.getItem('token');
  console.log('user id', storedUser.id);

  const [eventData, setEvents] = React.useState<EventType[]>([]);
  const {isAuthenticated} = useContext(AuthContext);

  const {loading, error, data, refetch} = useQuery(getUserEvents, {
    variables: {id: storedUser.id},
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  console.log('data', data);
  console.log('error', error);
  console.log('loading', loading);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('user id', storedUser.id);
    console.log('storedUserData', storedUserData);
    console.log('token', token);
    if (!storedUserData) {
      console.log('no user');
      return;
    }
    console.log('fetching data');
    console.log('isAuthenticated', isAuthenticated);
    //   const fetchData = async () => {
    //     const data = await doGraphQLFetch(API_URL, getUserEvents, {
    //       userId: storedUser.id,
    //       token,
    //     });
    //     console.log('data', data);
    //     if (data && data.events) {
    //       const validEvents = data.events.filter((event: any) => event !== null);
    //       setEvents(validEvents);
    //     }
    //   };

    //   fetchData();
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
