import {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {userSettings} from '../src/graphql/userQueries';
import bcrypt from 'bcryptjs';
import {
  likedEvents,
  attendingEvents,
  getUserEvents,
} from '../src/graphql/queries';
import {EventType} from '../src/types/EventType';
import EventCard from '../src/components/EventCard';
import {AuthContext} from '../src/context/AuthContext';

function UpdateUserForm() {
  const token = localStorage.getItem('token');
  const userFromLocal = localStorage.getItem('user');
  const userFromLocalObj = JSON.parse(userFromLocal || '{}');

  // Inside your component
  const {isAuthenticated} = useContext(AuthContext);
  //console.log('Token from localStorage:', token);
  const [user, setUser] = useState({
    user_name: userFromLocalObj.user_name || '',
    email: userFromLocalObj.email || '',
    password: '',
  });
  const userId = userFromLocalObj.id;
  const [likedEventsData, setLikedEventsData] = useState<EventType[]>([]);
  const [attendingEventsData, setAttendingEvents] = useState<EventType[]>([]);
  const [createdEvents, setCreatedEvents] = useState<EventType[]>([]);

  const [updateUser] = useMutation(userSettings, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  const {data: attendingData} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });

  const {data: createdEventsData} = useQuery(getUserEvents, {
    variables: {userId},
    skip: !userId,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure userFromLocalObj is defined and contains an id
    if (userFromLocalObj && userFromLocalObj.id) {
      console.log('userFromLocalObj.id:', userFromLocalObj.id);
      console.log('user.user_name:', user.user_name);
      console.log('user.email:', user.email);
      console.log(' (laitonta, tiedän) user.password:', user.password);

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const {data} = await updateUser({
        variables: {
          user: {
            id: userFromLocalObj.id,
            user_name: user.user_name,
            email: user.email,
            password: hashedPassword,
          },
        },
      });
      console.log('data:', data);
    } else {
      console.error('User ID not found in local storage.');
    }
  };

  useEffect(() => {
    // Set liked events data
    console.log('likedData', likedData);
    if (likedData && likedData.favoritedEventsByUserId) {
      const likedEventsDisplay = likedData.favoritedEventsByUserId.slice(0, 4);
      setLikedEventsData(likedEventsDisplay);
    }
  }, [likedData]);

  useEffect(() => {
    // Set attending events data
    console.log('attendingData', attendingData);
    if (attendingData && attendingData.attendedEventsByUserId) {
      const attendingEventsDisplay = attendingData.attendedEventsByUserId.slice(
        0,
        4,
      );
      setAttendingEvents(attendingEventsDisplay);
    }
  }, [attendingData]);

  useEffect(() => {
    // Set created events data
    console.log('createdEventsData', createdEventsData);
    if (createdEventsData) {
      const createdEventsDisplay =
        createdEventsData.createdEventsByUserId.slice(0, 4);
      setCreatedEvents(createdEventsDisplay);
    }
  }, [createdEventsData]);

  if (isAuthenticated) {
    return (
      <div
        style={{
          paddingBottom: '3rem',
          paddingRight: '3rem',
          paddingLeft: '3rem',
        }}
      >
        <h1 className="text-5xl font-bold text-center">
          Hello, {user.user_name}
        </h1>
        <div className="bg-accent p-10 mt-5 rounded-lg">
          <div>
            <div
              className="bg-base-100 rounded-lg text-center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              {/* UPDATE USER */}
              <div>
                <h2 className="text-xl font-bold">Update your user info</h2>
                <div
                  style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <form>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '1rem',
                      }}
                    >
                      <label>Username:</label>
                      <input
                        className="input input-bordered w-1/3  mt-3"
                        type="text"
                        name="user_name"
                        value={user.user_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '1rem',
                      }}
                    >
                      <label>Email:</label>
                      <input
                        className="input input-bordered w-full  mt-3 "
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '1rem',
                      }}
                    >
                      <label>Password:</label>
                      <input
                        className="input input-bordered w-full  mt-3"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                      />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {/* CREATED EVENTS */}
            <div
              className="bg-base-100 p-10 rounded-lg mt-5"
              style={{
                maxHeight: '1000px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h2 className="text-xl font-bold">Your events</h2>
              <div>
                {createdEventsData && (
                  <>
                    {createdEvents.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                          }}
                        >
                          <EventCard event={event} />
                        </div>

                        <a
                          className="link flex justify-end"
                          href={`/userEvents`}
                        >
                          see all your events and edit them here
                        </a>
                      </>
                    ))}
                    {createdEvents.length === 0 && (
                      <div>
                        <p>You have not created any events yet</p>
                        <a
                          className="btn btn-primary mt-5"
                          href={`/createEvent`}
                        >
                          Create event
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* LIKED EVENTS */}
            <div
              className="bg-base-100 p-10 rounded-lg mt-5"
              style={{
                maxHeight: '1000px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h2 className="text-xl font-bold">Liked Events</h2>
              <div>
                {likedEventsData && (
                  <>
                    {likedEventsData.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                          }}
                        >
                          <EventCard event={event} />
                        </div>
                        <a
                          className="link flex justify-end"
                          href={`/likedEvents`}
                        >
                          More...
                        </a>
                      </>
                    ))}
                    {likedEventsData.length === 0 && (
                      <p>You have not liked any events yet</p>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* ATTENDING */}
            <div
              className="bg-base-100 p-10 rounded-lg mt-5"
              style={{
                maxHeight: '1000px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h2 className="text-xl font-bold">Attending</h2>
              <div>
                {attendingEvents && (
                  <>
                    {attendingEventsData.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                          }}
                        >
                          <EventCard event={event} />
                        </div>
                        <a
                          className="link flex justify-end"
                          href={`/attending`}
                        >
                          More...
                        </a>
                      </>
                    ))}
                    {attendingEventsData.length === 0 && (
                      <p>You are not attending any events yet</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-accent flex justify-center items-center flex-col text-center mx-5 p-10 rounded-box ">
        <div className="bg-base-100 p-10 rounded-box ">
          <p>Log in to see your user page</p>
        </div>
      </div>
    );
  }
}

export default UpdateUserForm;
