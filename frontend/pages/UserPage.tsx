import {ChangeEvent, FormEvent, useState} from 'react';
import {useMutation} from '@apollo/client';
import {userSettings} from '../src/graphql/userQueries';
import bcrypt from 'bcryptjs';

function UpdateUserForm() {
  const token = localStorage.getItem('token');
  const userFromLocal = localStorage.getItem('user');
  const userFromLocalObj = JSON.parse(userFromLocal || '{}');
  //console.log('Token from localStorage:', token);
  const [user, setUser] = useState({
    user_name: userFromLocalObj.user_name || '',
    email: userFromLocalObj.email || '',
    password: '',
  });

  const [updateUser] = useMutation(userSettings, {
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  //console.log('Authorization header:', token ? `Bearer ${token}` : '');

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

  return (
    <div>
      <h1>User Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="user_name"
            value={user.user_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password: {/* Add password input field */}
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateUserForm;
