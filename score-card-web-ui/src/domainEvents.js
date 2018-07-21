import { ClientId } from './state/id'
import * as domain from './score-card-domain'

function withClientId(eventCreator) {
  return input => eventCreator({ clientId: ClientId, ...input })
}

export const startGame = withClientId(domain.startGame)
export const joinGame = withClientId(domain.joinGame)
export const addPlayerToGame = withClientId(domain.addPlayerToGame)
export const changeName = withClientId(domain.changeName)
export const recordScore = withClientId(domain.recordScore)
export const removePlayer = withClientId(domain.removePlayer)
