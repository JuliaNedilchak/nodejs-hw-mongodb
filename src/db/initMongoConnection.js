import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from '../utils/env.js';
dotenv.config();
export async function initMongoConnection() {
  try {
    const user = env('MONGODB_USER');
    const psw = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${psw}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('"Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
}
//MONGODB_USER=JuliaDatabase

//MONGODB_URL=cluster0.nzw4amg.mongodb.net
//MONGODB_DB=contacts
//mongodb+srv://JuliaDatabase:<password>@cluster0.nzw4amg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
