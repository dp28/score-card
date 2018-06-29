import express from 'express';
import expressWebsockets from 'express-ws';

import { ConnectionManager } from './connectionManager.mjs'
import { GameManager } from './gameManager.mjs'
import { mountRoutes } from './routes/index.mjs'

const ServerPort = 8080;
const app = express();
expressWebsockets(app);

const connectionManager = new ConnectionManager();
const gameManager = new GameManager(connectionManager.sendToConnection.bind(connectionManager));

mountRoutes({ app, connectionManager, gameManager })

app.listen(ServerPort);
console.log(`Running at localhost:${ServerPort}`);
