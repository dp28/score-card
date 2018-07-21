import { connect } from 'mongodb-bluebird'

import Config from '../config'
import { log } from '../logger.mjs'

const CollectionName = `${Config.COLLECTION_PREFIX}events`

export async function buildGameEventRepository() {
  try {
    const database = await connect(process.env.MONGODB_URI)
    log('Connected to MongoDB')
    return new GameEventRepository(database)
  }
  catch (error) {
    console.error('Failed to connect to MongoDB')
    throw error
  }
}

class GameEventRepository {

  constructor(db) {
    this._events = db.collection(CollectionName)
  }

  async store(gameEvent) {
    return await this._events.insert(gameEvent)
  }

  async findByGameId(gameId) {
    return await this._events.find({
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
