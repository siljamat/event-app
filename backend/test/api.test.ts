import app from '../src/app';
import {
  adminDeleteUser,
  deleteUser,
  getSingleUser,
  getUser,
  // loginBrute,
  loginUser,
  postUser,
  putUser,
} from './userFunctions';
import mongoose from 'mongoose';
import {getNotFound} from './testFunctions';

const uploadApp = process.env.UPLOAD_URL as string;

import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import {LoginResponse, UploadResponse} from '../src/types/MessageTypes';
import {UserTest} from '../src/types/DBTypes';

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
    email: 'admin@metropolia.fi',
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

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!);
  });

  // test brute force protectiom
  // test('Brute force attack simulation', async () => {
  //   const maxAttempts = 20;
  //   const mockUser: UserTest = {
  //     user_name: 'Test User ' + randomstring.generate(7),
  //     email: randomstring.generate(9) + '@user.fi',
  //     password: 'notthepassword',
  //   };

  //   try {
  //     // Call the mock login function until the maximum number of attempts is reached
  //     for (let i = 0; i < maxAttempts; i++) {
  //       const result = await loginBrute(app, mockUser);
  //       if (result) throw new Error('Brute force attack unsuccessful');
  //     }

  //     // If the while loop completes successfully, the test fails
  //     throw new Error('Brute force attack succeeded');
  //   } catch (error) {
  //     console.log(error);
  //     // If the login function throws an error, the test passes
  //     expect((error as Error).message).toBe('Brute force attack unsuccessful');
  //   }
  // }, 15000);
});
