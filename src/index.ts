import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import config from 'config';

import { initApp } from './app';
import { initLogger } from './libs/logger';

const logger = initLogger();
const app = initApp(logger);
const server = http.createServer(app);
const PORT = config.get<number>('server.port');

server.listen(PORT, () => {
  logger.info(`Server listening at http://localhost:${PORT}`);
});
