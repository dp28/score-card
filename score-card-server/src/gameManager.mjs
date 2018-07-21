import { reducer } from './score-card-domain.mjs'
import { log } from './logger.mjs'

export class GameManager {

  constructor(sendToConnection, gameEventRepository) {
    this._gameConnectionIdMap = new Map()
    this.sendToConnection = sendToConnection
    this._gameEventRepository = gameEventRepository
  }

  async addGameEvent(gameEvent, senderConnectionId) {
    const game = await this._fetchGame(gameEvent.gameId)
    this._subscribeConnectionToGame(senderConnectionId, game)
    await this._gameEventRepository.store(gameEvent)
    this._broadcastEvent(gameEvent, game, senderConnectionId)
  }

  getGameCount() {
    return this._gameConnectionIdMap.size
  }

  async getCurrentGameState(gameId) {
    const events = await this._getGameEvents(gameId)
    if (events.length > 0) {
      return events.reduce(reducer, undefined)
    }
    return null
  }

  async getMostRecentGameForClientId(clientId) {
    const gameId = await this._gameEventRepository.findMostRecentGameId(clientId)
    return gameId ? await this.getCurrentGameState(gameId) : null
  }

  async _fetchGame(gameId) {
    const events = await this._getGameEvents(gameId)
    const connectionIds = this._fetchGameConnectionIds(gameId)
    return { id: gameId, events, connectionIds }
  }

  async _getGameEvents(gameId) {
    return await this._gameEventRepository.findByGameId(gameId)
  }

  _fetchGameConnectionIds(gameId) {
    if (this._gameConnectionIdMap.has(gameId)) {
      return this._gameConnectionIdMap.get(gameId)
    }
    const connectionIds = new Set([])
    this._gameConnectionIdMap.set(gameId, connectionIds)
    return connectionIds
  }

  _subscribeConnectionToGame(connectionId, game) {
    if (connectionId && !game.connectionIds.has(connectionId)) {
      log('Adding subscriber to game', { connectionId, gameId: game.id })
      game.connectionIds.add(connectionId)
      game.events.forEach(event => this.sendToConnection(connectionId, event))
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
