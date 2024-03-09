/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// EventCard.tsx
import {getEventById, getEventsByMinAge} from '../graphql/eventQueries';
import {Suspense} from 'react';
import {TypedDocumentNode, useSuspenseQuery} from '@apollo/client';

interface Event {
  id: string;
  created_at: Date;
  event_name: string;
  description: string;
  date: Date;
  location: string;
  email: string;
  organizer: string;
  address: string;
  age_restriction: string;
  event_site: string;
  ticket_site: string;
  price: string;
  image: string;
  category: string;
  creator: string;
  favoriteCount: number;
}

interface EventVars {
  id: string;
}

interface EventProps {
  id: string;
}

function EventCard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Eventti id="65eaef57f510009dada82fec" />
    </Suspense>
  );
}

function Eventti({id}: EventProps) {
  const {data} = useSuspenseQuery(getEventById, {
    variables: {id},
  });

  return <>Event: {(data as Event)?.event_name}</>;
}

export default EventCard;
