import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import config from 'config';

import { initApp } from './app';
import { initLogger } from './libs/logger';

const logger = initLogger();
const { app, port } = initApp(logger);
const server = http.createServer(app);

mongoose
  .connect(config.get('db.url'), {
    dbName: 'incrementalProject',
  })
  .then(() => {
    server.listen(port, () => {
      logger.info(`Server listening at http://localhost:${port}`);
    });
  });
