import cors from 'cors';
import pino from 'pino-http';
import express from 'express';
//import { Contact } from './db/contacts.js';
import { getAllCOntacts } from './services/contactRequest.js';

//dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllCOntacts();
      console.log(contacts);
      res.status(200).json({ data: contacts });
    } catch (error) {
      console.log(error);
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
