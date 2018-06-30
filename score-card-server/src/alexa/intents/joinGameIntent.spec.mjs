import { buildJoinGameIntent } from './joinGameIntent.mjs'

describe('JoinGameIntent', () => {
  let intent
  let gameManager
  let selectTotals

  beforeEach(() => {
    selectTotals = jest.fn()
    gameManager = {
      getCurrentGameState: jest.fn()
    }
    intent = buildJoinGameIntent({ gameManager, domain: { selectTotals } })
  })

  describe('#requestHandler', () => {
    let requestHandler
    let request
    let response
    let session
    let call = () => requestHandler(request, response)

    function getResponseText() {
      return response.say.mock.calls.map(args => args[0]).join(' ')
    }

    beforeEach(() => {
      session = { set: jest.fn() }
      request = {
        slot: jest.fn(),
        getSession: jest.fn()
      }
      request.getSession.mockReturnValue(session)
      response = {
        say: jest.fn(),
        shouldEndSession: jest.fn()
      }
      requestHandler = intent.requestHandler
    })

    it('should keep the session running', () => {
      call()
      expect(response.shouldEndSession.mock.calls).toEqual([[false]])
    })

    describe('when no id can be build from the input', () => {
      beforeEach(() => {
        request.slot = () => undefined
      })

      it('should tell the user that the id is wrong', () => {
        call()
        expect(getResponseText()).toMatch(/game\W+id/i)
      })

      it('should not try and fetch a game', () => {
        call()
        expect(gameManager.getCurrentGameState.mock.calls.length).toBe(0)
      })
    })

    describe('when an id can be build from the input', () => {
      beforeEach(() => {
        request.slot = name => name.toLowerCase()
      })

      it('should try and fetch a game using the correct id format', () => {
        call()
        expect(gameManager.getCurrentGameState.mock.calls).toEqual([[
          'adjective-animal-number'
        ]])
      })

      describe('when no game can be found', () => {
        it('should repeat the id to the user', () => {
          call()
          expect(getResponseText()).toMatch(/adjective animal number/)
        })

        it('should not try and save the id in the session', () => {
          call()
          expect(request.getSession.mock.calls.length).toBe(0)
        })
      })

      describe('when the game can be found', () => {
        beforeEach(() => gameManager.getCurrentGameState.mockReturnValue({}))

        it('should save the id in the session', () => {
          selectTotals.mockReturnValue([])
          call()
          expect(session.set.mock.calls).toEqual([['gameId', 'adjective-animal-number']])
        })

        describe('without any players', () => {
          it('should tell the user no players are in the game', () => {
            selectTotals.mockReturnValue([])
            call()
            expect(getResponseText()).toMatch(/no players/)
          })
        })

        describe('with one player', () => {
          it('should tell the user the player\'s total', () => {
            selectTotals.mockReturnValue([{ playerName: 'Daniel', total: 21 }])
            call()
            expect(getResponseText()).toMatch(/Daniel has 21 points/)
          })
        })

        describe('with two players', () => {
          it('should tell the user the players\' totals, separated by "and"', () => {
            selectTotals.mockReturnValue([
              { playerName: 'Daniel', total: 21 },
              { playerName: 'John', total: 22 },
            ])
            call()
            expect(getResponseText()).toMatch(/Daniel has 21 points and John has 22 points/)
          })
        })

        describe('with three or more players', () => {
          it('should tell the user the players\' totals, comma separated but "and" for the last two', () => {
            selectTotals.mockReturnValue([
              { playerName: 'Daniel', total: 21 },
              { playerName: 'John', total: 22 },
              { playerName: 'Joe', total: 32 }
            ])
            call()
            expect(getResponseText()).toMatch(
              /Daniel has 21 points, John has 22 points and Joe has 32/
            )
          })
        })
      })
    })
  })
})
