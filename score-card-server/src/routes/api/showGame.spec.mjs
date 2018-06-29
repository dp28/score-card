import { buildShowGameRoute } from './showGame.mjs'

describe('showGameRoute', () => {
  let connectionManager;
  let gameManager;
  let showGameRoute;

  beforeEach(() => {
    connectionManager = {}
    gameManager = {
      getCurrentGameState: jest.fn()
    }
    showGameRoute = buildShowGameRoute({ connectionManager, gameManager })
  })

  it('should have a root path', () => {
    expect(showGameRoute.path).toEqual('/api/games/:gameId')
  })

  it('should have the name "showGame"', () => {
    expect(showGameRoute.name).toEqual('showGame')
  })

  it('should have method "get"', () => {
    expect(showGameRoute.method).toEqual('get')
  })

  describe('.requestHandler', () => {
    let request;
    let response;

    beforeEach(() => {
      request = {}
      response = { send: jest.fn() }
    })

    it('should send the result of getting the game from the gameManager', () => {
      const game = { a: 1, b: 2 }
      gameManager.getCurrentGameState.mockReturnValue(game)
      request.params = { gameId: '1' }

      showGameRoute.requestHandler(request, response)
      expect(response.send.mock.calls).toEqual([[game]])
    })

    describe('if the game manager returns null', () => {
      beforeEach(() => {
        gameManager.getCurrentGameState.mockReturnValue(null)
          request.params = { gameId: 'not-found' }
          response.status = jest.fn()
          response.status.mockReturnValue({ send: response.send })
      })

      it('should reply with a 404 error', () => {
        showGameRoute.requestHandler(request, response)
        expect(response.status.mock.calls).toEqual([[404]])
      })

      it('should reply with an error message', () => {
        showGameRoute.requestHandler(request, response)
        expect(response.send.mock.calls).toEqual([[{
          success: false,
          error: 'Game not found'
        }]])
      })
    })
  })
})
