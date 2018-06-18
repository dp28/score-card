const { generateId } = require('../ids.js')

const START_GAME = 'GAMES.START'
const ADD_PLAYER = 'GAMES.PLAYERS.ADD'
const REMOVE_PLAYER = 'GAMES.PLAYERS.REMOVE'
const RECORD_SCORE = 'GAMES.SCORES.ADD'

function startGame() {
  return {
    ...buildEvent(START_GAME),
    gameId: generateId()
  }
}

function addPlayerToGame({ playerName, gameId }) {
  return {
    ...buildEvent(ADD_PLAYER),
    gameId,
    playerName,
    playerId: generateId()
  }
}

function recordScore({ score, playerId, gameId }) {
  return {
    ...buildEvent(RECORD_SCORE),
    gameId,
    playerId,
    score
  }
}

function removePlayer({ playerId, gameId }) {
  return {
    ...buildEvent(REMOVE_PLAYER),
    gameId,
    playerId
  }
}

function buildEvent(eventType) {
  return {
    eventType,
    id: generateId(),
    createdAt: new Date()
  }
}

module.exports = {
  START_GAME,
  ADD_PLAYER,
  RECORD_SCORE,
  REMOVE_PLAYER,
  startGame,
  addPlayerToGame,
  recordScore,
  removePlayer
}
