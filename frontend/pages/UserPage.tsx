import {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {userSettings} from '../src/graphql/userQueries';
import bcrypt from 'bcryptjs';
import {getUserEvents} from '../src/graphql/eventQueries';
import {likedEvents, attendingEvents} from '../src/graphql/queries';
import {EventType} from '../src/types/EventType';
import EventCard from '../src/components/EventCard';
import {AuthContext} from '../src/context/AuthContext';

/**
 * UpdateUserForm component allows the user to update their information.
 * @returns {JSX.Element} The rendered UpdateUserForm component.
 */
function UpdateUserForm() {
  const token = localStorage.getItem('token');
  const userFromLocal = localStorage.getItem('user');
  const userFromLocalObj = JSON.parse(userFromLocal || '{}');

  const {isAuthenticated} = useContext(AuthContext);

  /**
   * @type {React.State<object>} user - The state variable where the user information is stored.
   * @function setUser - The function to update the user state.
   */
  const [user, setUser] = useState({
    user_name: userFromLocalObj.user_name || '',
    email: userFromLocalObj.email || '',
    password: '',
  });
  const userId = userFromLocalObj.id;

  /**
   * @type {React.State<EventType[]>} likedEventsData - The state variable where the liked events are stored.
   * @function setLikedEventsData - The function to update the likedEventsData state.
   */
  const [likedEventsData, setLikedEventsData] = useState<EventType[]>([]);

  /**
   * @type {React.State<EventType[]>} attendingEventsData - The state variable where the attending events are stored.
   * @function setAttendingEvents - The function to update the attendingEventsData state.
   */
  const [attendingEventsData, setAttendingEvents] = useState<EventType[]>([]);

  /**
   * @type {React.State<EventType[]>} createdEvents - The state variable where the created events are stored.
   * @function setCreatedEvents - The function to update the createdEvents state.
   */
  const [createdEvents, setCreatedEvents] = useState<EventType[]>([]);

  /**
   * @type {object} updateUser - The mutation function to update the user.
   */
  const [updateUser] = useMutation(userSettings, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  /**
   * @type {object} likedData - The data returned from the likedEvents query.
   */
  const {data: likedData} = useQuery(likedEvents, {
    variables: {userId},
    skip: !userId,
  });

  /**
   * @type {object} attendingData - The data returned from the attendingEvents query.
   */
  const {data: attendingData} = useQuery(attendingEvents, {
    variables: {userId},
    skip: !userId,
  });

  /**
   * @type {object} createdEventsData - The data returned from the getUserEvents query.
   */
  const {data: createdEventsData} = useQuery(getUserEvents, {
    variables: {userId},
    skip: !userId,
  });

  // Set liked events data
  useEffect(() => {
    console.log('likedData', likedData);
    if (likedData && likedData.favoritedEventsByUserId) {
      const likedEventsDisplay = likedData.favoritedEventsByUserId.slice(0, 4);
      setLikedEventsData(likedEventsDisplay);
    }
  }, [likedData]);

  // Set attending events data
  useEffect(() => {
    console.log('attendingData', attendingData);
    if (attendingData && attendingData.attendedEventsByUserId) {
      const attendingEventsDisplay = attendingData.attendedEventsByUserId.slice(
        0,
        4,
      );
      setAttendingEvents(attendingEventsDisplay);
    }
  }, [attendingData]);

  // Set created events data
  useEffect(() => {
    console.log('createdEventsData', createdEventsData);
    if (createdEventsData) {
      const createdEventsDisplay =
        createdEventsData.createdEventsByUserId.slice(0, 4);
      setCreatedEvents(createdEventsDisplay);
    }
  }, [createdEventsData]);

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
      if (data) {
        console.log('data:', data);
        if (data.updateUser.user) {
          console.log('data.updateUser:', data.updateUser.user);
          const updatedUser = {
            id: userId,
            user_name: data.updateUser.user.user_name,
            email: data.updateUser.user.email,
            password: hashedPassword,
          };
          console.log('updatedUser APSFJADEOGHJ:', updatedUser);
          if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('User info updated successfully');
          }
        }
      } else {
        alert('error updating user info ');
      }
    } else {
      console.error('User ID not found in local storage.');
    }
  };

  if (isAuthenticated) {
    return (
      <div
        style={{
          paddingBottom: '3rem',
          paddingRight: '3rem',
          paddingLeft: '3rem',
        }}
      >
        <h1 className="text-2xl font-bold text-center">
          Hello, {userFromLocalObj.user_name}
        </h1>
        <div className=" p-10 rounded-lg">
          <div>
            <div
              className="bg-accent rounded-lg text-center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              {/* UPDATE USER */}
              <div
                className="bg-base-100 rounded-lg"
                style={{
                  padding: '2rem',
                }}
              >
                <h2 className="text-2xl mb-3">Update your user info</h2>
                <div
                  style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <form onSubmit={handleSubmit}>
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
            <div className="flex flex-col mt-5">
              <h2 className="text-2xl text-center">Your events</h2>
              <a className="link text-center" href={`/userEvents`}>
                see all your events and edit them here
              </a>
            </div>
            <div
              className="bg-accent p-10 rounded-lg mt-5"
              style={{
                maxHeight: '800px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'auto',
              }}
            >
              <div>
                {createdEventsData && (
                  <>
                    {createdEvents.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <EventCard event={event} />
                        </div>
                      </>
                    ))}

                    {createdEvents.length === 0 && (
                      <div className="bg-base-100 p-10 rounded-lg">
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
            <h2 className="text-2xl text-center mt-5">Liked Events</h2>

            <div
              className="bg-accent p-10 rounded-lg mt-5"
              style={{
                maxHeight: '800px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'auto',
              }}
            >
              <div>
                {likedEventsData && (
                  <>
                    {likedEventsData.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
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
                      <p className="bg-base-100 p-10 rounded-lg">
                        You have not liked any events yet
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* ATTENDING */}
            <h2 className="text-2xl text-center mt-5">Attending</h2>

            <div
              className="bg-accent p-10 rounded-lg mt-5"
              style={{
                maxHeight: '800px',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'auto',
              }}
            >
              <div>
                {attendingEvents && (
                  <>
                    {attendingEventsData.map((event: EventType) => (
                      <>
                        <div
                          key={event.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
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
                      <p className="bg-base-100 p-10 rounded-lg">
                        You are not attending any events yet
                      </p>
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
