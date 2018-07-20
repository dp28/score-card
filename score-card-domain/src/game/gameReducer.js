import {
  START_GAME,
  ADD_PLAYER,
  RECORD_SCORE,
  REMOVE_PLAYER,
  JOIN_GAME,
  CHANGE_NAME
} from './gameEvents'
import { merge } from '../utils'

const INITIAL_STATE = {
  id: undefined,
  startedAt: undefined,
  players: {},
  totals: {},
  rounds: []
}

const EventSpecificReducers = {
  [START_GAME]: startGame,
  [CHANGE_NAME]: changeName,
  [JOIN_GAME]: joinGame,
  [ADD_PLAYER]: addPlayer,
  [RECORD_SCORE]: recordScore,
  [REMOVE_PLAYER]: removePlayer
}

export function gameReducer(game = INITIAL_STATE, event) {
  const eventReducer = EventSpecificReducers[event.type]
  return eventReducer ? eventReducer(game, event) : game
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

function startGame(game, { gameId, gameName, createdAt }) {
  if (Boolean(game.startedAt)) {
    return game
  }
  const safeId = game.id || gameId
  return merge(INITIAL_STATE, { id: safeId, name: gameName, startedAt: createdAt })
}

function joinGame(game, { gameId }) {
  if (Boolean(game.id)) {
    return game
  }
  return merge(game, { id: gameId, startedAt: null })
}

function changeName(game, { gameName }) {
  return merge(game, { name: gameName })
}
