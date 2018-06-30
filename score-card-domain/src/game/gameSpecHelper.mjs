import {
  startGame,
  addPlayerToGame,
  recordScore
} from './gameEvents'

import { gameReducer } from './gameReducer'

export function buildStartedGame() {
  const initialState = gameReducer(undefined, { type: undefined })
  return gameReducer(initialState, startGame())
}

export function buildStartedGameWithPlayer() {
  const game = buildStartedGame()
  const playerEvent = addPlayerToGame({ playerName: 'test', gameId: game.id })
  const player = { id: playerEvent.playerId, name: playerEvent.playerName }
  return { player, game: gameReducer(game, playerEvent) }
}

export function buildStartedGameWithScore(score = 10) {
  const { game, player } = buildStartedGameWithPlayer()
  const scoreEvent = recordScore({ score, playerId: player.id, gameId: game.id })
  return { player, game: gameReducer(game, scoreEvent) }
}
