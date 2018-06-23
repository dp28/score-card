import { generateId } from '../ids.mjs'

export const START_GAME = 'GAMES.START'
export const ADD_PLAYER = 'GAMES.PLAYERS.ADD'
export const REMOVE_PLAYER = 'GAMES.PLAYERS.REMOVE'
export const RECORD_SCORE = 'GAMES.SCORES.ADD'

export function startGame() {
  return {
    ...buildEvent(START_GAME),
    gameId: generateId()
  }
}

export function addPlayerToGame({ playerName, gameId }) {
  return {
    ...buildEvent(ADD_PLAYER),
    gameId,
    playerName,
    playerId: generateId()
  }
}

export function recordScore({ score, playerId, gameId }) {
  return {
    ...buildEvent(RECORD_SCORE),
    gameId,
    playerId,
    score
  }
}

export function removePlayer({ playerId, gameId }) {
  return {
    ...buildEvent(REMOVE_PLAYER),
    gameId,
    playerId
  }
}

export function buildEvent(eventType) {
  return {
    eventType,
    id: generateId(),
    createdAt: new Date()
  }
}
