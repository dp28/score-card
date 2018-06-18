const {
  START_GAME,
  ADD_PLAYER,
  RECORD_SCORE,
  REMOVE_PLAYER
} = require('./gameEvents')

class GameAggregator {

  constructor(createGameEvent) {
    this.game = gameReducer({}, createGameEvent)
  }

  update(event) {
    this.game = gameReducer(this.game, event)
  }

  get state() {
    return this.game
  }

}

function gameReducer(game, event) {
  switch (event.eventType) {
    case RECORD_SCORE: return recordScore(game, event)
    case ADD_PLAYER: return addPlayer(game, event)
    case START_GAME: return buildInitialGameState(event.gameId, event.createdAt)
    case REMOVE_PLAYER: return removePlayer(game, event)
    default: throw new Error(`Cannot update error from event type "${event.eventType}"`)
  }
}

function recordScore(game, scoreEvent) {
  return {
    ...game,
    totals: {
      ...game.totals,
      [scoreEvent.playerId]: game.totals[scoreEvent.playerId] + scoreEvent.score
    },
    rounds: addScoreToRounds(game.rounds, scoreEvent)
  }
}

function addScoreToRounds(rounds, scoreEvent) {
  if (rounds.length > 0) {
    return addScoreToExistingRounds(rounds, scoreEvent)
  }
  return [buildNewRound(scoreEvent)]
}

function addScoreToExistingRounds(rounds, scoreEvent) {
  const lastRound = rounds[rounds.length - 1]
  if (lastRound.scores.hasOwnProperty(scoreEvent.playerId)) {
    const newLastRound = buildNewRound(scoreEvent, rounds.length)
    return rounds.concat([newLastRound])
  }
  const updatedLastRound = addScoreToRound(lastRound, scoreEvent)
  return rounds.slice(0, rounds.length - 1).concat([updatedLastRound])
}

function buildNewRound({ playerId, score }, index = 0) {
  return { index, scores: { [playerId]: score } }
}

function addScoreToRound(round, { playerId, score }) {
  return {
    ...round,
    scores: {
      ...round.scores,
      [playerId]: score
    }
  }
}

function addPlayer(game, { playerId, playerName }) {
  return {
    ...game,
    players: {
      ...game.players,
      [playerId]: { id: playerId, name: playerName }
    },
    totals: {
      ...game.totals,
      [playerId]: 0
    }
  }
}

function removePlayer(game, { playerId }) {
  const deletePlayerFromMap = deleteFromMap(playerId)
  return {
    ...game,
    players: deletePlayerFromMap(game.players),
    totals: deletePlayerFromMap(game.totals),
    rounds: game.rounds.map(round => ({
      ...round,
      scores: deletePlayerFromMap(round.scores)
    }))
  }
}

function deleteFromMap(key) {
  return map => {
    const copy = { ...map }
    delete copy[key]
    return copy
  }
}

function buildInitialGameState(id, startedAt) {
  return {
    id,
    startedAt,
    players: {},
    totals: {},
    rounds: []
  }
}

function buildGameAggregator(createGameEvent) {
  if (createGameEvent.eventType !== START_GAME) {
    throw new Error(`Cannot build game without "${START_GAME}" event type`)
  }
  return new GameAggregator(createGameEvent)
}

module.exports = {
  buildGameAggregator
}
