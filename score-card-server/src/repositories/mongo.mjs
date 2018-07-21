import { connect } from 'mongodb-bluebird'

import Config from '../config'
import { log } from '../logger.mjs'

export async function getCollection(name) {
  const collectionName = `${Config.COLLECTION_PREFIX}${name}`
  const db = await getDatabaseConnection()
  return db.collection(collectionName)
}

let connection

async function getDatabaseConnection() {
  if (!connection) {
    connection = connect(process.env.MONGODB_URI)
    connection.then(() => log('Connected to MongoDB'))
  }
  return await connection
}
