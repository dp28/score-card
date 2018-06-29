export class GameManager {

  constructor(sendToConnection) {
    this.gameMap = new Map();
    this.sendToConnection = sendToConnection;
  }

  addGameEvent(gameEvent, senderConnectionId) {
    const game = this._fetchGame(gameEvent.gameId);
    this._subscribeConnectionToGame(senderConnectionId, game);
    game.events.push(gameEvent);
    this._broadcastEvent(gameEvent, game, senderConnectionId);
  }

  getGameCount() {
    return this.gameMap.size
  }

  _fetchGame(gameId) {
    if (this.gameMap.has(gameId)) {
      return this.gameMap.get(gameId);
    }
    const game = this._createGame(gameId);
    this.gameMap.set(gameId, game);
    return game;
  }

  _createGame(gameId) {
    return {
      id: gameId,
      events: [],
      connectionIds: new Set([])
    }
  }

  _subscribeConnectionToGame(connectionId, game) {
    if (connectionId && !game.connectionIds.has(connectionId)) {
      console.log('Adding subscriber to game', { connectionId, gameId: game.id });
      game.connectionIds.add(connectionId);
      game.events.forEach(event => this.sendToConnection(connectionId, event));
    }
  }

  _broadcastEvent(gameEvent, game, senderConnectionId) {
    game.connectionIds.forEach(connectionId => {
      if (connectionId !== senderConnectionId) {
        this.sendToConnection(connectionId, gameEvent)
      }
    })
  }
}
