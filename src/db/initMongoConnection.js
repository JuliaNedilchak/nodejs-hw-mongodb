import mongoose from 'mongoose';

export async function initMongoConnection() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('"Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
}
