const {
  startGame,
  START_GAME,
  addPlayerToGame,
  ADD_PLAYER,
  recordScore,
  RECORD_SCORE,
  removePlayer,
  REMOVE_PLAYER
} = require('./gameEvents')

const { buildGameAggregator } = require('./gameAggregator')

describe('buildGameAggregator', () => {
  it(`should throw an error if not created with a ${START_GAME} event`, () => {
    expect(() => buildGameAggregator({})).toThrow()
  })

  it(`should not throw an error if created with a ${START_GAME} event`, () => {
    expect(() => buildGameAggregator(startGame())).not.toThrow()
  })

  it('should have state containing the gameId and startedAt from the event,' +
    ' no players, no totals, no rounds', () => {
    const event = startGame()
    const aggregator = buildGameAggregator(event)
    expect(aggregator.state).toEqual({
      id: event.gameId,
      startedAt: event.createdAt,
      players: {},
      totals: {},
      rounds: []
    })
  })

  function buildStartedGameAggregator() {
    const event = startGame()
    return { gameId: event.gameId, aggregator: buildGameAggregator(event) }
  }

  function buildStartedGameAggregatorWithPlayer() {
    const { gameId, aggregator } = buildStartedGameAggregator()
    const event = addPlayerToGame({ playerName: 'test', gameId })
    aggregator.update(event)
    return { gameId, aggregator, playerId: event.playerId, playerName: event.playerName }
  }

  describe('calling #update with an unknown event type', () => {
    it('should throw an error', () => {
      const { aggregator } = buildStartedGameAggregator()
      expect(() => aggregator.update({ eventType: 'unknown' })).toThrow()
    })
  })

  describe(`calling #update with a ${ADD_PLAYER} event`, () => {
    it('should add a player with the id and name to the player map', () => {
      const { aggregator, playerId, playerName } = buildStartedGameAggregatorWithPlayer()
      expect(aggregator.state.players).toEqual({
        [playerId]: {
          id: playerId,
          name: playerName
        }
      })
    })

    it('should add a total of 0 for the player', () => {
      const { aggregator, playerId } = buildStartedGameAggregatorWithPlayer()
      expect(aggregator.state.totals).toEqual({ [playerId]: 0 })
    })

    describe('adding another player', () => {
      it('should add both players to the players map', () => {
      const { gameId, aggregator, playerId } = buildStartedGameAggregatorWithPlayer()
        const secondPlayerEvent = addPlayerToGame({ playerName: 'test 2', gameId })
        aggregator.update(secondPlayerEvent)
        expect(Object.keys(aggregator.state.players)).toEqual([
          playerId,
          secondPlayerEvent.playerId
        ])
      })

      it('should add both players to the totals map', () => {
      const { gameId, aggregator, playerId } = buildStartedGameAggregatorWithPlayer()
        const secondPlayerEvent = addPlayerToGame({ playerName: 'test 2', gameId })
        aggregator.update(secondPlayerEvent)
        expect(Object.keys(aggregator.state.totals)).toEqual([
          playerId,
          secondPlayerEvent.playerId
        ])
      })
    })
  })

  function buildStartedGameAggregatorWithScore(score = 10) {
    const { aggregator, playerId, gameId } = buildStartedGameAggregatorWithPlayer()
    const scoreEvent = recordScore({ score, playerId, gameId })
    aggregator.update(scoreEvent)
    return { aggregator, playerId, gameId }
  }

  describe(`calling #update with a ${RECORD_SCORE} event`, () => {
    it('should update the total for the player by the specified score', () => {
      const { aggregator, playerId } = buildStartedGameAggregatorWithScore(10)
      expect(aggregator.state.totals[playerId]).toEqual(10)
    })

    it('should not change other players\' totals', () => {
      const { aggregator, playerId, gameId } = buildStartedGameAggregatorWithPlayer()
      const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId })
      const scoreEvent = recordScore({ score: 10, playerId, gameId })
      aggregator.update(playerEvent)
      aggregator.update(scoreEvent)
      expect(aggregator.state.totals[playerEvent.playerId]).toEqual(0)
    })

    describe(`calling #update with another ${RECORD_SCORE} event for the same player`, () => {
      it('should update the total for the player to be the sum of the scores', () => {
        const { aggregator, playerId, gameId } = buildStartedGameAggregatorWithScore(10)
        const anotherScoreEvent = recordScore({ score: 12, playerId, gameId })
        aggregator.update(anotherScoreEvent)
        expect(aggregator.state.totals[playerId]).toEqual(22)
      })
    })

    describe('if there are no rounds', () => {
      it('should create a new one', () => {
        const { aggregator } = buildStartedGameAggregatorWithScore()
        expect(aggregator.state.rounds.length).toBe(1)
      })

      describe('the created round', () => {
        const { aggregator, playerId } = buildStartedGameAggregatorWithScore(20)
        const round = aggregator.state.rounds[0]

        it('should have the index value "0"', () => {
          expect(round.index).toBe(0)
        })

        it('should have the score for the player in the scores map', () => {
          expect(round.scores[playerId]).toBe(20)
        })
      })
    })

    describe('if there is a round', () => {
      describe('but the player has not scored in it', () => {
        it('should not create a new one', () => {
          const { aggregator, gameId } = buildStartedGameAggregatorWithScore()
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId })
          aggregator.update(playerEvent)
          expect(aggregator.state.rounds.length).toBe(1)

          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId })
          aggregator.update(scoreEvent)

          expect(aggregator.state.rounds.length).toBe(1)
        })

        it('should have the score for the player in the scores map', () => {
          const { aggregator, gameId } = buildStartedGameAggregatorWithScore(20)
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId })
          aggregator.update(playerEvent)

          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId })
          aggregator.update(scoreEvent)
          expect(aggregator.state.rounds[0].scores[playerEvent.playerId]).toBe(10)
        })

        it('should have the score for the previous player in the scores map', () => {
          const {
            aggregator,
            gameId,
            playerId: previousPlayerId
          } = buildStartedGameAggregatorWithScore(20)
          const playerEvent = addPlayerToGame({ playerName: 'otherPlayer', gameId })
          aggregator.update(playerEvent)

          const scoreEvent = recordScore({ score: 10, playerId: playerEvent.playerId, gameId })
          aggregator.update(scoreEvent)
          expect(aggregator.state.rounds[0].scores[previousPlayerId]).toBe(20)
        })
      })

      describe('and the player has scored in it', () => {
        it('should create a new round', () => {
          const { aggregator, gameId, playerId } = buildStartedGameAggregatorWithScore(20)
          expect(aggregator.state.rounds.length).toBe(1)

          const scoreEvent = recordScore({ score: 10, playerId, gameId })
          aggregator.update(scoreEvent)

          expect(aggregator.state.rounds.length).toBe(2)
        })

        describe('the created round', () => {
          const { aggregator, gameId, playerId } = buildStartedGameAggregatorWithScore(20)
          const scoreEvent = recordScore({ score: 10, playerId, gameId })
          aggregator.update(scoreEvent)

          const round = aggregator.state.rounds[1]

          it('should have an index value one higher than the previous round', () => {
            expect(round.index).toBe(1)
          })

          it('should have the new round score for the player in the scores map', () => {
            expect(round.scores[playerId]).toBe(10)
          })
        })
      })
    })
  })

  describe(`calling #update with a ${REMOVE_PLAYER} event`, () => {
    it('should remove the player from the the player map', () => {
      const { aggregator, gameId, playerId } = buildStartedGameAggregatorWithScore()
      aggregator.update(removePlayer({ gameId, playerId }))
      expect(aggregator.state.players.hasOwnProperty(playerId)).toEqual(false)
    })

    it('should remove the player from the totals', () => {
      const { aggregator, gameId, playerId } = buildStartedGameAggregatorWithPlayer()
      aggregator.update(removePlayer({ gameId, playerId }))
      expect(aggregator.state.totals.hasOwnProperty(playerId)).toEqual(false)
    })

    it('should remove the player from all the rounds', () => {
      const { aggregator, gameId, playerId } = buildStartedGameAggregatorWithPlayer()
      aggregator.update(removePlayer({ gameId, playerId }))
      expect(
        aggregator.state.rounds.every(round => !round.scores.hasOwnProperty(playerId))
      ).toEqual(true)
    })
  })
})
