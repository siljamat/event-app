//module is in strict mode by default ;)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Connect to the MongoDB database.
 * @returns {Promise<mongoose.Connection>} The connection object.
 */
const mongoConnect = async () => {
  const connection = await mongoose.connect(process.env.DATABASE_URL as string);
  console.log('DB connected successfully');
  return connection;
};

export default mongoConnect;
