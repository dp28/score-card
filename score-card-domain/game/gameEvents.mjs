import { generateId } from '../ids.mjs'
import { merge } from '../utils.mjs'

export const START_GAME = 'GAMES.START'
export const ADD_PLAYER = 'GAMES.PLAYERS.ADD'
export const REMOVE_PLAYER = 'GAMES.PLAYERS.REMOVE'
export const RECORD_SCORE = 'GAMES.SCORES.ADD'

export function startGame() {
  return merge(buildEvent(START_GAME), { gameId: generateId() })
}

export function addPlayerToGame({ playerName, gameId }) {
  return merge(
    buildEvent(ADD_PLAYER),
    {
      gameId,
      playerName,
      playerId: generateId()
    }
  )
}

export function recordScore({ score, playerId, gameId }) {
  return merge(
    buildEvent(RECORD_SCORE),
    { gameId, playerId, score }
  )
}

export function removePlayer({ playerId, gameId }) {
  return merge(
    buildEvent(REMOVE_PLAYER),
    { gameId, playerId }
  )
}

export function buildEvent(type) {
  return {
    type,
    id: generateId(),
    createdAt: new Date()
  }
}
