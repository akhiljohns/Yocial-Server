import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const mongoconn = process.env.MONGODB_SERVER;
const dbName = process.env.DB_NAME

export const connect = async () => {
  try {
    await mongoose.connect(mongoconn, { dbName });
    console.log(`Connected To The Database ${dbName}`);
  } catch (error) {
    console.error('Error connecting to Database:', error);
  }
};

