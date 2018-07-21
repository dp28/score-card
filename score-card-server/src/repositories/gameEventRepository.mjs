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
    return await this._eventCollection.find({
      $query: { gameId },
      $orderBy: { createdAt: -1 }
    }).map(removeMongoId)
  }
}

function removeMongoId(object) {
  const safe = Object.assign(object)
  delete safe._id
  return safe
}
