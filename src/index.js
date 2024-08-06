import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
//import { Contact } from './db/contacts.js';
//import express from 'express';

//const app = express();

async function startApplication() {
  await initMongoConnection();
  setupServer();
}

startApplication();
