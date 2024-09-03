import cors from 'cors';
import pino from 'pino-http';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { auth } from './middlewares/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

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
  app.use(cookieParser());
  //app.use(express.json());
  app.use('/auth', authRoutes);
  app.use(auth, contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
