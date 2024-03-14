import app from '../src/app';
import {
  adminDeleteUser,
  deleteUser,
  getSingleUser,
  getUser,
  loginUser,
  postUser,
  putUser,
  toggleAttendingEvent,
  toggleFavoriteEvent,
} from './userFunctions';
import {postEvent, putEvent, deleteEvent} from './eventFunctions';
import {deleteCategory, postCategory, putCategory} from './categoryFunctions';
import {getNotFound} from './testFunctions';
import mongoose from 'mongoose';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import {LoginResponse} from '../src/types/MessageTypes';
import {CategoryTest, UserTest} from '../src/types/DBTypes';

describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  // test create user
  let userData: LoginResponse;
  let userData2: LoginResponse;
  let adminData: LoginResponse;

  const testUser: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
  };

  const testUser2: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
  };

  const adminUser: UserTest = {
    email: 'admin@test.fi',
    password: '12345',
  };

  // create first user
  it('should create a new user', async () => {
    await postUser(app, testUser);
  });

  // create second user to try to modify someone else's cats and userdata
  it('should create second user', async () => {
    await postUser(app, testUser2);
  });

  // test login
  it('should login user', async () => {
    const vars = {
      credentials: {
        username: testUser.email!,
        password: testUser.password!,
      },
    };
    userData = await loginUser(app, vars);
  });

  // test login with second user
  it('should login second user', async () => {
    const vars = {
      credentials: {
        username: testUser2.email!,
        password: testUser2.password!,
      },
    };
    userData2 = await loginUser(app, vars);
  });

  // test login with admin
  it('should login admin', async () => {
    const vars = {
      credentials: {
        username: adminUser.email!,
        password: adminUser.password!,
      },
    };
    adminData = await loginUser(app, vars);
  });

  // make sure token has role (so that we can test if user is admin or not)
  it('token should have role', async () => {
    const dataFromToken = jwt.verify(
      userData.token!,
      process.env.JWT_SECRET as string,
    );
    expect(dataFromToken).toHaveProperty('role');
  });

  // test get all users
  it('should return array of users', async () => {
    await getUser(app);
  });

  // test get single user
  it('should return single user', async () => {
    await getSingleUser(app, userData.user.id!);
  });

  // test update user
  it('should update user', async () => {
    await putUser(app, userData.token!);
  });

  const testEvent = {
    event_name: 'test_event',
    description: 'test description',
    date: new Date(),
    email: 'test@gmail.com',
    address: 'Hämeentie 1',
    age_restriction: '18',
    price: '0',
    organizer: 'test organizer',
  };

  it('should create a new event', async () => {
    await postEvent(app, testEvent, userData.token);
  });

  it('should update an event', async () => {
    await putEvent(app, testEvent, userData.token, '');
  });

  /*it('should delete an event', async () => {
    await deleteEvent(app, testEvent, userData.token);
  });*/

  // test delete user by id as admin
  it('should delete a user as admin', async () => {
    const result = await adminDeleteUser(
      app,
      userData2.user.id,
      adminData.token,
    );
    console.log(
      'user2id',
      userData2.user.id,
      'adminid',
      adminData.user.id,
      result,
    );
  });

  // test toggle favorite
  it('should toggle favorite event', async () => {
    await toggleFavoriteEvent(
      app,
      userData.token!,
      '65f2de6e6f2ec1f512dcd6f9'!,
    );
  });

  // test toggle attendance
  it('should toggle attendance to an event', async () => {
    await toggleAttendingEvent(
      app,
      userData.token!,
      '65f2de6e6f2ec1f512dcd6f9'!,
    );
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!, userData.user.id!);
  });

  const testCategory: CategoryTest = {
    category_name: 'test category',
  };

  // test create category
  it('should create a new category', async () => {
    await postCategory(app, testCategory, adminData.token);
  });

  // test update category
  it('should update a category', async () => {
    await putCategory(app, 'test category', testCategory, adminData.token);
  });

  // test delete category
  it('should delete a category', async () => {
    await deleteCategory(app, 'test category', adminData.token);
  });
});
