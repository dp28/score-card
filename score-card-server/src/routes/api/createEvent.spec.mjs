import { buildCreateEventRoute } from './createEvent.mjs'

describe('createEventRoute', () => {
  let connectionManager;
  let gameManager;
  let createEventRoute;

  beforeEach(() => {
    connectionManager = {
      getConnectionCount: jest.fn()
    }
    gameManager = {
      getGameCount: jest.fn(),
      addGameEvent: jest.fn()
    }
    createEventRoute = buildCreateEventRoute({ connectionManager, gameManager })
  })

  it('should have a root path', () => {
    expect(createEventRoute.path).toEqual('/api/events')
  })

  it('should have the name "createEvent"', () => {
    expect(createEventRoute.name).toEqual('createEvent')
  })

  it('should have method "post"', () => {
    expect(createEventRoute.method).toEqual('post')
  })

  describe('.requestHandler', () => {
    let request;
    let response;

    beforeEach(() => {
      request = { body: {} }
      response = { send: jest.fn() }
    })

    it('should send a success message to the response', () => {
      request.body = { gameId: '1' }
      createEventRoute.requestHandler(request, response)
      expect(response.send.mock.calls[0][0]).toEqual({ success: true })
    })

    it('should send the passed-in event to the GameManager without a connectionId', () => {
      const event = { gameId: '1' }
      request.body = event
      createEventRoute.requestHandler(request, response)
      expect(gameManager.addGameEvent.mock.calls).toEqual([[event]])
    })

    describe('if the request does not contain a game event', () => {
      it('should reply with a 400 error', () => {
        request.body = { bad: 'stuff' }
        response.status = jest.fn()
        response.status.mockReturnValue({ send: () => {} })
        createEventRoute.requestHandler(request, response)
        expect(response.status.mock.calls).toEqual([[400]])
      })

      it('should reply with an error message', () => {
        request.body = { bad: 'stuff' }
        response.status = jest.fn()
        response.status.mockReturnValue({ send: response.send })
        createEventRoute.requestHandler(request, response)
        expect(response.send.mock.calls).toEqual([[{
          success: false,
          error: 'Invalid event'
        }]])
      })
    })
  })
})
