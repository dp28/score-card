import { generateId, generateReadableId } from '../ids.js'
import { merge } from '../utils.js'

export const START_GAME = 'GAMES.START'
export const ADD_PLAYER = 'GAMES.PLAYERS.ADD'
export const REMOVE_PLAYER = 'GAMES.PLAYERS.REMOVE'
export const RECORD_SCORE = 'GAMES.SCORES.ADD'
export const JOIN_GAME = 'GAMES.JOIN'
export const CHANGE_NAME = 'GAMES.EDIT.NAME'

export function startGame({ gameName = null } = {}) {
  return merge(buildEvent(START_GAME), { gameName, gameId: generateReadableId() })
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

export function joinGame({ gameId }) {
  return merge(buildEvent(JOIN_GAME), { gameId })
}

export function changeName({ gameName, gameId }) {
  return merge(buildEvent(CHANGE_NAME), { gameName, gameId })
}


export function buildEvent(type) {
  return {
    type,
    id: generateId(),
    createdAt: new Date()
  }
}
