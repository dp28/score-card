const express = require('express');
const app = express();
require('express-ws')(app);

const ServerPort = 8080;

const clients = {};
const games = {};

function fetchGameForClient(gameId, clientId) {
  if (!games.hasOwnProperty(gameId)) {
    games[gameId] = {
      clientIds: [clientId],
      events: []
    };
    console.log(`New game (id: ${gameId}) - now ${Object.keys(games).length}`);
  }

  const game = games[gameId];

  if (!game.clientIds.includes(clientId)) {
    game.clientIds.push(clientId);
    game.events.forEach(event => clients[clientId].connection.send(JSON.stringify(event)));
  }
  return game;
}

app.get('/', (request, response) => {
  response.send('Server is up and running ... try connecting over WebSockets');
});

app.ws('/', websocketConnection => {
  const id = String(Math.random());
  const client = { id, connection: websocketConnection };
  clients[id] = client;

  websocketConnection.on('message', rawMessage => {
    const jsonMessage = JSON.parse(rawMessage);
    const game = fetchGameForClient(jsonMessage.gameId, id);

    game.events.push(jsonMessage);

    game.clientIds.forEach(clientId => {
      if (clientId !== id && clients.hasOwnProperty(clientId)) {
        clients[clientId].connection.send(rawMessage);
      }
    })
  });

  websocketConnection.on('close', () => {
    delete clients[id]
    console.log(`Client disconnected - now ${Object.keys(clients).length} connected`);
  })
});

app.listen(ServerPort);
console.log(`Running at localhost:${ServerPort}`);
