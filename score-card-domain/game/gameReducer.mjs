import {
  START_GAME,
  ADD_PLAYER,
  RECORD_SCORE,
  REMOVE_PLAYER
} from './gameEvents.mjs'
import { merge } from '../utils.mjs'

const INITIAL_STATE = {
  id: undefined,
  startedAt: undefined,
  players: {},
  totals: {},
  rounds: []
}

export function gameReducer(game = INITIAL_STATE, event) {
  switch (event.type) {
    case RECORD_SCORE: return recordScore(game, event)
    case ADD_PLAYER: return addPlayer(game, event)
    case START_GAME: return startGame(game, event)
    case REMOVE_PLAYER: return removePlayer(game, event)
    default: return game
  }
}

function recordScore(game, scoreEvent) {
  return merge(
    game,
    {
      rounds: addScoreToRounds(game.rounds, scoreEvent),
      totals: merge(
        game.totals,
        {
          [scoreEvent.playerId]: game.totals[scoreEvent.playerId] + scoreEvent.score
        }
      ),
    }
  )
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
  return merge(
    round,
    {
      scores: merge(round.scores, { [playerId]: score })
    }
  )
}

function addPlayer(game, { playerId, playerName }) {
  const player = { id: playerId, name: playerName }
  return merge(
    game,
    {
      players: merge(game.players, { [playerId]: player }),
      totals: merge(game.totals, { [playerId]: 0 })
    }
  )
}

function removePlayer(game, { playerId }) {
  const deletePlayerFromMap = deleteFromMap(playerId)
  return merge(
    ...game,
    {
      players: deletePlayerFromMap(game.players),
      totals: deletePlayerFromMap(game.totals),
      rounds: game.rounds.map(round => (
        merge(round, { scores: deletePlayerFromMap(round.scores) })
      ))
    }
  )
}

function deleteFromMap(key) {
  return map => {
    const copy = Object.assign({}, map)
    delete copy[key]
    return copy
  }
}

function startGame(game, { gameId, createdAt }) {
  if (Boolean(game.id)) {
    return game
  }
  return merge(INITIAL_STATE, { id: gameId, startedAt: createdAt })
}
