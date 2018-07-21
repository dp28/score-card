import { getCollection } from './mongo.mjs'

export async function buildGameEventRepository() {
  const eventCollection = await getCollection('events')
  return new GameEventRepository(eventCollection)
}

class GameEventRepository {

  constructor(eventCollection) {
    this._eventCollection = eventCollection
  }

  async store(gameEvent) {
    return await this._eventCollection.insert(gameEvent)
  }

  async findByGameId(gameId) {
    return await this._eventCollection.find(
      { gameId },
      undefined,
      { sort: [['createdAt', 'asc']] }
    ).map(removeMongoId)
  }

  async findMostRecentGameId(clientId) {
    const mostRecentGameEvents = await this._eventCollection.find(
      { clientId },
      { gameId: 'gameId '},
      { sort: [['createdAt', 'desc']], limit: 1 }
    )
    return mostRecentGameEvents.length ? mostRecentGameEvents[0].gameId : null
  }
}

function removeMongoId(object) {
  const safe = Object.assign(object)
  delete safe._id
  return safe
}
