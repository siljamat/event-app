/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {EventTest} from '../src/types/DBTypes';

const postEvent = (
  url: string | Function,
  eventInput: EventTest,
  token: string,
): Promise<EventTest> => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation CreateEvent($input: InputEvent) {
            createEvent(input: $input) {
              id
              event_name
            }
          }`,
        variables: {
          input: eventInput,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const eventData = response.body.data.createEvent;
          expect(eventData).toHaveProperty('id');
          resolve(eventData);
        }
      });
  });
};

const putEvent = (
  url: string | Function,
  eventInput: EventTest,
  token: string,
  id: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateEvent($updateEventId: ID!, $input: updateEvent! {
          updateEvent(id: $updateEventId, input: $input) {
              id
              event_name
            }
          }`,
        variables: {
          updateEventId: id,
          input: eventInput,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const eventData = response.body.data.updateEvent;
          expect(eventData).toHaveProperty('id');
          resolve(eventData);
        }
      });
  });
};

const deleteEvent = (url: string | Function, id: number, token: string) => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteEvent($id: Int!) {
            deleteEvent(id: $id)
          }`,
        variables: {
          id: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const eventData = response.body.data.deleteEvent;
          expect(eventData).toBe(true);
          resolve(eventData);
        }
      });
  });
};

export {postEvent, putEvent, deleteEvent};
