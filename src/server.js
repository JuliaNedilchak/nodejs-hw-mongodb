import cors from 'cors';
import pino from 'pino-http';
import express from 'express';
import { Contact } from './db/contacts.js';

//dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export function setupServer() {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      console.log(contacts);
      res.send({ status: 200, data: contacts });
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
