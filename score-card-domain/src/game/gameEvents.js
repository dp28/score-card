import { generateId, generateReadableId } from '../ids.js'
import { merge } from '../utils.js'

export const START_GAME = 'GAMES.START'
export const ADD_PLAYER = 'GAMES.PLAYERS.ADD'
export const REMOVE_PLAYER = 'GAMES.PLAYERS.REMOVE'
export const RECORD_SCORE = 'GAMES.SCORES.ADD'
export const JOIN_GAME = 'GAMES.JOIN'
export const CHANGE_NAME = 'GAMES.EDIT.NAME'

export function startGame({ clientId, gameName = null } = {}) {
  return merge(
    baseEvent(START_GAME, clientId),
    { gameName, gameId: generateReadableId() }
  )
}

export const addPlayerToGame = gameEventCreator(
  ADD_PLAYER,
  ({ playerName }) => ({ playerName, playerId: generateId() })
)

export const joinGame = gameEventCreator(JOIN_GAME)
export const changeName = gameEventCreator(CHANGE_NAME, pick('gameName'))
export const recordScore = gameEventCreator(RECORD_SCORE, pick('playerId', 'score'))
export const removePlayer = gameEventCreator(REMOVE_PLAYER, pick('playerId'))

function gameEventCreator(type, createDetails = () => ({})) {
  return input => merge(
    createDetails(input),
    baseEvent(type, input.clientId),
    { gameId: input.gameId }
  )
}

function baseEvent(type, clientId) {
  return {
    type,
    clientId,
    id: generateId(),
    createdAt: new Date()
  }
}

function pick(...propertyNames) {
  return object => propertyNames.reduce(
    (result, propertyName) => {
      result[propertyName] = object[propertyName]
      return result
    }, {})
}
