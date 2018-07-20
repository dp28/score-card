import { buildAlexaMocks } from '../alexaSpecHelper.mjs'
import { buildJoinGameIntent } from './joinGameIntent.mjs'

describe('JoinGameIntent', () => {
  let intent
  let gameManager
  let selectTotals
  let request
  let response
  let session
  let domain

  beforeEach(() => {
    domain = {}
    const mocks = buildAlexaMocks({ withSession: true })
    gameManager = mocks.gameManager
    request = mocks.request
    response = mocks.response
    session = mocks.session
    intent = buildJoinGameIntent({ gameManager, domain })
  })

  describe('#requestHandler', () => {
    let call = () => intent.requestHandler(request, response)

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
        expect(response.asText()).toMatch(/game\W+id/i)
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
          expect(response.asText()).toMatch(/adjective animal number/)
        })

        it('should not try and save the id in the session', () => {
          call()
          expect(request.getSession.mock.calls.length).toBe(0)
        })
      })

      describe('when the game can be found', () => {
        beforeEach(() => {
          domain.selectGameName = jest.fn()
          domain.selectPlayerNames = jest.fn()
          domain.selectPlayerNames.mockReturnValue([])
          gameManager.getCurrentGameState.mockReturnValue({})
        })

        it('should save the id in the session', () => {
          call()
          expect(session.set.mock.calls).toEqual([['gameId', 'adjective-animal-number']])
        })

        it('should read the game\'s name', () => {
          domain.selectGameName.mockReturnValue('beanie')
          call()
          expect(response.asText()).toMatch(/beanie/)
        })

        describe('if the game does not have a name', () => {
          it('should say the game\'s id', () => {
            gameManager.getCurrentGameState.mockReturnValue({ id: 'test id' })
            domain.selectGameName.mockReturnValue(undefined)
            call()
            expect(response.asText()).toMatch(/test id/)
          })
        })

        describe('if no players have been added', () => {
          it('should say that there are no players', () => {
            domain.selectPlayerNames.mockReturnValue([])
            call()
            expect(response.asText()).toMatch(/no players/i)
          })
        })

        describe('if multiple players have been added', () => {
          beforeEach(() => {
            domain.selectPlayerNames.mockReturnValue(['John', 'Joe', 'McDowell'])
          })

          it('should read the all the players\' names', () => {
            call()
            expect(response.asText()).toMatch(/John, Joe and McDowell/)
          })

          it('should read the number of players', () => {
            call()
            expect(response.asText()).toMatch(/3/)
          })
        })

        describe('if only one player has been added', () => {
          beforeEach(() => { domain.selectPlayerNames.mockReturnValue(['Daniel']) })
          it('should say that there is only one player', () => {
            call()
            expect(response.asText()).toMatch(/only/i)
          })

          it('should say that their name', () => {
            domain.selectPlayerNames.mockReturnValue(['Daniel'])
            call()
            expect(response.asText()).toMatch(/Daniel/i)
          })

          it('should not pluralise player', () => {
            domain.selectPlayerNames.mockReturnValue(['Daniel'])
            call()
            expect(response.asText()).toMatch(/player[^s]/i)
          })
        })
      })
    })
  })
})
