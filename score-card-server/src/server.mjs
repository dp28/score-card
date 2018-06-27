import express from 'express';
import expressWebsockets from 'express-ws';

import { ConnectionManager } from './connectionManager.mjs'
import { GameManager } from './gameManager.mjs'

const ServerPort = 8080;
const app = express();
expressWebsockets(app);

const connectionManager = new ConnectionManager();
const gameManager = new GameManager(connectionManager.sendToConnection.bind(connectionManager));

app.get('/', (request, response) => {
  response.send('Server is up and running ... try connecting over WebSockets');
});

app.ws('/', websocketConnection => {
  const connectionId = connectionManager.registerConnection(websocketConnection);
  console.log(`Client connected - now ${connectionManager.getConnectionCount()}`);

  websocketConnection.on('message', rawMessage => {
    const jsonMessage = JSON.parse(rawMessage);
    gameManager.addGameEvent(jsonMessage, connectionId);
  });

  websocketConnection.on('close', () => {
    console.log(`Client disconnected - ${connectionManager.getConnectionCount()} left`);
  });
});

app.listen(ServerPort);
console.log(`Running at localhost:${ServerPort}`);
