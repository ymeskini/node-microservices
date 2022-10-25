import http from 'http';
import debug from 'debug';
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();

import { app } from './app';

const server = http.createServer(app);
const serverPort = config.get<number>('port');
const PORT = serverPort;
const log = debug('app');

debug.enable('app');

server.listen(PORT, () => {
  log(`Server listening at http://localhost:${PORT}`);
});
