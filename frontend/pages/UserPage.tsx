// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/ban-types */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, {useEffect, useContext, useState} from 'react';
// //import {doGraphQLFetch} from '../src/graphql/fetch';
// //import {getUserEvents} from '../src/graphql/eventQueries';
// import {EventType} from '../src/types/EventType';
// import {AuthContext} from '../src/context/AuthContext';
// import {ApolloError, useMutation, useQuery} from '@apollo/client';
// import {getUser} from '../src/graphql/userQueries';
// import {userSettings} from '../src/graphql/userQueries';

// const UserPage: React.FC = () => {
//   const storedUserData = localStorage.getItem('user');
//   const storedUser = JSON.parse(storedUserData as string);
//   const token = localStorage.getItem('token');
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [eventData, setEvents] = React.useState<EventType[]>([]);
//   const {isAuthenticated} = useContext(AuthContext);

//   const [updateUser] = useMutation(userSettings);
//   const [inputUserName, setInputUserName] = useState(storedUser.user_name);
//   const [inputEmail, setInputEmail] = useState(storedUser.email);

//   function refetchUser() {
//     throw new Error('Function not implemented.');
//   }

//   //Tästä saadaan tietokannasta käyttäjän tiedot
//   const {
//     loading,
//     error,
//     data: userData,
//   } = useQuery(getUser, {
//     variables: {id: storedUser.id},
//   });

//   useEffect(() => {
//     console.log(storedUser.id);
//     if (!storedUserData) {
//       console.log('no user');
//       return;
//     }
//     //console.log('fetching data');
//     //console.log('isAuthenticated', isAuthenticated);
//   }, [API_URL, isAuthenticated, storedUserData]);

//   //Tämän suoritus ei ikinä toteudu
//   const handleUpdate = async () => {
//     console.log('Tässä userdata', userData);
//     console.log('Tässä inputUserName', inputUserName);
//     console.log('update user'); //Tähän asti console logit tulee
//     updateStoredUser(inputUserName, inputEmail);
//     try {
//       await updateUser({
//         variables: {
//           user: {
//             id: storedUser.id,
//             user_name: inputUserName,
//             email: inputEmail,
//           },
//         },
//       });

//       updateStoredUser(inputUserName, inputEmail);

//       refetchUser();
//       console.log('Updated user:', inputUserName);
//     } catch (error) {
//       if (error instanceof ApolloError) {
//         console.error('GraphQL error:', error.graphQLErrors);
//         console.error('Network error:', error.networkError);
//       }
//     }
//   };

//   function updateStoredUser(newUserName: string, newEmail: string) {
//     const updatedUser = {
//       ...storedUser,
//       user_name: newUserName,
//       email: newEmail,
//     };

//     localStorage.setItem('user', JSON.stringify(updatedUser));
//   }

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return (
//     <div>
//       <h1>User Page</h1>
//       <h2>Update User Information</h2>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleUpdate();
//         }}
//       >
//         <label>
//           Username:
//           <input
//             type="text"
//             value={inputUserName}
//             onChange={(e) => setInputUserName(e.target.value)}
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={inputEmail}
//             onChange={(e) => setInputEmail(e.target.value)}
//           />
//         </label>
//         <button type="submit">Update</button>
//       </form>
//     </div>
//   );
// };

// export default UserPage;
