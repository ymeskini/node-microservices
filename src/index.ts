import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import config from 'config';

import { initApp } from './app';
import { initLogger } from './libs/logger';

const logger = initLogger();
const app = initApp(logger);
const server = http.createServer(app);
const PORT = config.get<number>('server.port');
const DB_URL = config.get<string>('db.url');
const DB_NAME = config.get<string>('db.dbName');

mongoose
  .connect(DB_URL, {
    dbName: DB_NAME,
  })
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server listening at http://localhost:${PORT}`);
    });
  });
