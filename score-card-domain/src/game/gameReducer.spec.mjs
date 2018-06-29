import {
  startGame,
  START_GAME,
  addPlayerToGame,
  ADD_PLAYER,
  recordScore,
  RECORD_SCORE,
  removePlayer,
  REMOVE_PLAYER,
  joinGame,
  JOIN_GAME
} from './gameEvents'

import { gameReducer } from './gameReducer'

function buildStartedGame() {
  const initialState = gameReducer(undefined, { type: undefined })
  return gameReducer(initialState, startGame())
}

function buildStartedGameWithPlayer() {
  const game = buildStartedGame()
  const playerEvent = addPlayerToGame({ playerName: 'test', gameId: game.id })
  const player = { id: playerEvent.playerId, name: playerEvent.playerName }
  return { player, game: gameReducer(game, playerEvent) }
}

describe('gameReducer', () => {
  describe('calling with an unknown event type', () => {
    it('should return the passed-in game state', () => {
      const state = { a: 1 }
      expect(gameReducer(state, { type: 'fake' })).toBe(state)
    })
  })

  describe('calling without any game state', () => {
    it('should return a default unstarted game state', () => {
      expect(gameReducer(undefined, { type: 'fake' })).toEqual({
        id: undefined,
        startedAt: undefined,
        players: {},
        totals: {},
        rounds: []
      })
    })
  })

  describe(`calling with a ${START_GAME} event`, () => {
    it('should have state containing the gameId and startedAt from the event,' +
      ' no players, no totals, no rounds', () => {
      const event = startGame()
      expect(gameReducer(undefined, event)).toEqual({
        id: event.gameId,
        startedAt: event.createdAt,
        players: {},
        totals: {},
        rounds: []
      })
    })

    describe('if there is an existing game already', () => {
      it('should not change the game', () => {
        const { game } = buildStartedGameWithPlayer()
        const updatedGame = gameReducer(game, startGame())
        expect(updatedGame).toBe(game)
      })

      describe('which has been joined but not started (has no startedAt)', () => {
        it('should add the createdAt from the start event', () => {
          const game = gameReducer(undefined, joinGame({ gameId: 'bla' }))
          const startEvent = startGame()
          const updatedGame = gameReducer(game, startEvent)
          expect(updatedGame).toEqual({
            id: 'bla',
            startedAt: startEvent.createdAt,
            players: {},
            totals: {},
            rounds: []
          })
        })
      })
    })
  })

  describe(`calling with a ${JOIN_GAME} event`, () => {
    it('should have state containing the gameId from the event, but null' +
      'startedAt, no players, no totals, no rounds', () => {
      const event = joinGame({ gameId: 'bla' })
      expect(gameReducer(undefined, event)).toEqual({
        id: event.gameId,
        startedAt: null,
        players: {},
        totals: {},
        rounds: []
      })
    })

    describe('if there is an existing game already', () => {
      it('should not change the game', () => {
        const { game } = buildStartedGameWithPlayer()
        const updatedGame = gameReducer(game, joinGame({ gameId: game.id }))
        expect(updatedGame).toBe(game)
      })
    })
  })

  describe(`calling with a ${ADD_PLAYER} event`, () => {
    it('should add a player with the id and name to the player map', () => {
      const { game, player } = buildStartedGameWithPlayer()
      expect(game.players).toEqual({ [player.id]: player })
    })

    it('should add a total of 0 for the player', () => {
      const { game, player } = buildStartedGameWithPlayer()
      expect(game.totals).toEqual({ [player.id]: 0 })
    })

    describe('adding another player', () => {
      it('should add both players to the players map', () => {
        const { game, player } = buildStartedGameWithPlayer()
        const secondPlayerEvent = addPlayerToGame({ playerName: 'test 2', gameId: game.id })
        const updatedGame = gameReducer(game, secondPlayerEvent)
        expect(Object.keys(updatedGame.players)).toEqual([
          player.id,
          secondPlayerEvent.playerId
        ])
      })

      it('should add both players to the totals map', () => {
        const { game, player } = buildStartedGameWithPlayer()
        const secondPlayerEvent = addPlayerToGame({ playerName: 'test 2', gameId: game.id })
        const updatedGame = gameReducer(game, secondPlayerEvent)
        expect(Object.keys(updatedGame.totals)).toEqual([
          player.id,
          secondPlayerEvent.playerId
        ])
      })
    })
  })

  function buildStartedGameWithScore(score = 10) {
    const { game, player } = buildStartedGameWithPlayer()
    const scoreEvent = recordScore({ score, playerId: player.id, gameId: game.id })
    return { player, game: gameReducer(game, scoreEvent) }
  }

  describe(`calling with a ${RECORD_SCORE} event`, () => {
    it('should update the total for the player by the specified score', () => {
      const { game, player } = buildStartedGameWithScore(10)
      expect(game.totals[player.id]).toEqual(10)
    })

    it('should not change other players\' totals', () => {
      const { game, player } = buildStartedGameWithPlayer()
      const otherPlayerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId: game.id })
      const scoreEvent = recordScore({ score: 10, playerId: player.id, gameId: game.id })
      const updatedGame = [otherPlayerEvent, scoreEvent].reduce(gameReducer, game)
      expect(updatedGame.totals[otherPlayerEvent.playerId]).toEqual(0)
    })

    describe(`calling with another ${RECORD_SCORE} event for the same player`, () => {
      it('should update the total for the player to be the sum of the scores', () => {
        const { game, player } = buildStartedGameWithScore(10)
        const scoreEvent = recordScore({ score: 12, playerId: player.id, gameId: game.id })
        const updatedGame = gameReducer(game, scoreEvent)
        expect(updatedGame.totals[player.id]).toEqual(22)
      })
    })

    describe('if there are no rounds', () => {
      it('should create a new one', () => {
        const { game, player } = buildStartedGameWithScore()
        expect(game.rounds.length).toBe(1)
      })

      describe('the created round', () => {
        const { game, player } = buildStartedGameWithScore(20)
        const round = game.rounds[0]

        it('should have the index value "0"', () => {
          expect(round.index).toBe(0)
        })

        it('should have the score for the player in the scores map', () => {
          expect(round.scores[player.id]).toBe(20)
        })
      })
    })

    describe('if there is a round', () => {
      describe('but the player has not scored in it', () => {
        it('should not create a new one', () => {
          const { game, player } = buildStartedGameWithScore()
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId: game.id })
          const withAnotherPlayer = gameReducer(game, playerEvent)
          expect(withAnotherPlayer.rounds.length).toBe(1)

          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId: game.id })
          const withAnotherScore = gameReducer(withAnotherPlayer, scoreEvent)

          expect(withAnotherScore.rounds.length).toBe(1)
        })

        it('should have the score for the player in the scores map', () => {
          const { game, player } = buildStartedGameWithScore(20)
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId: game.id })
          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId: game.id })
          const updatedGame = [playerEvent, scoreEvent].reduce(gameReducer, game)
          expect(updatedGame.rounds[0].scores[playerEvent.playerId]).toBe(10)
        })

        it('should have the score for the previous player in the scores map', () => {
          const { game, player } = buildStartedGameWithScore(20)
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId: game.id })
          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId: game.id })
          const updatedGame = [playerEvent, scoreEvent].reduce(gameReducer, game)
          expect(updatedGame.rounds[0].scores[player.id]).toBe(20)
        })
      })

      describe('and the player has scored in it', () => {
        it('should create a new round', () => {
          const { game, player } = buildStartedGameWithScore(20)
          expect(game.rounds.length).toBe(1)

          const scoreEvent = recordScore({ score: 10, playerId: player.id, gameId: game.id })
          const updatedGame = gameReducer(game, scoreEvent)

          expect(updatedGame.rounds.length).toBe(2)
        })

        describe('the created round', () => {
          const { game, player } = buildStartedGameWithScore(20)
          const scoreEvent = recordScore({ score: 10, playerId: player.id, gameId: game.id })
          const updatedGame = gameReducer(game, scoreEvent)
          const round = updatedGame.rounds[1]

          it('should have an index value one higher than the previous round', () => {
            expect(round.index).toBe(1)
          })

          it('should have the new round score for the player in the scores map', () => {
            expect(round.scores[player.id]).toBe(10)
          })
        })
      })
    })
  })

  describe(`calling with a ${REMOVE_PLAYER} event`, () => {
    const { game, player } = buildStartedGameWithScore()
    const removeEvent = removePlayer({ gameId: game.id, playerId: player.id })
    const updatedGame = gameReducer(game, removeEvent)

    it('should remove the player from the the player map', () => {
      expect(updatedGame.players.hasOwnProperty(player.id)).toEqual(false)
    })

    it('should remove the player from the totals', () => {
      expect(updatedGame.totals.hasOwnProperty(player.id)).toEqual(false)
    })

    it('should remove the player from all the rounds', () => {
      const doesNotIncludePlayer = round => !round.scores.hasOwnProperty(player.id)
      expect(updatedGame.rounds.every(doesNotIncludePlayer)).toEqual(true)
    })
  })
})
