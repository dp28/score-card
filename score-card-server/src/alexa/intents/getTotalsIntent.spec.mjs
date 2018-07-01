import { buildGetTotalsIntent } from './getTotalsIntent.mjs'

describe('GetTotalsIntent', () => {
  let intent
  let gameManager
  let selectTotals

  beforeEach(() => {
    selectTotals = jest.fn()
    gameManager = {
      getCurrentGameState: jest.fn()
    }
    intent = buildGetTotalsIntent({ gameManager, domain: { selectTotals } })
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
      session = {
        set: jest.fn(),
        get: jest.fn()
      }
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

    it('should get the gameId from the session', () => {
      call()
      expect(session.get.mock.calls).toEqual([['gameId']])
    })

    describe('when no id can found in the session', () => {
      beforeEach(() => {
        session.get.mockReturnValue(undefined)
      })

      it('should tell the user that they have not joined a game', () => {
        call()
        expect(getResponseText()).toMatch(/join/i)
      })

      it('should not try and fetch a game', () => {
        call()
        expect(gameManager.getCurrentGameState.mock.calls.length).toBe(0)
      })
    })

    describe('when an id can be found in the session', () => {
      beforeEach(() => {
        session.get.mockReturnValue('fake-id')
      })

      it('should try and fetch a game using the id', () => {
        call()
        expect(gameManager.getCurrentGameState.mock.calls).toEqual([['fake-id']])
      })

      describe('when no game can be found', () => {
        it('should tell the user the game can no longer be found with that id', () => {
          call()
          expect(getResponseText()).toMatch(/(found|find).+fake id/)
        })
      })

      describe('when the game can be found', () => {
        beforeEach(() => gameManager.getCurrentGameState.mockReturnValue({}))

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
