export class GameManager {

  constructor(sendToConnection) {
    this.gameMap = new Map();
    this.sendToConnection = sendToConnection;
  }

  addGameEvent(gameEvent, senderConnectionId) {
    const game = this._fetchGame(gameEvent.gameId, senderConnectionId);
    this._subscribeConnectionToGame(senderConnectionId, game);
    game.events.push(gameEvent);
    this._broadcastEvent(gameEvent, game, senderConnectionId);
  }

  getGameCount() {
    return this.gameMap.size
  }

  _fetchGame(gameId, senderConnectionId) {
    if (this.gameMap.has(gameId)) {
      return this.gameMap.get(gameId);
    }
    const game = this._createGame(gameId, senderConnectionId);
    this.gameMap.set(gameId, game);
    return game;
  }

  _createGame(gameId, senderConnectionId) {
    return {
      id: gameId,
      events: [],
      connectionIds: new Set([senderConnectionId])
    }
  }

  _subscribeConnectionToGame(connectionId, game) {
    if (!game.connectionIds.has(connectionId)) {
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
