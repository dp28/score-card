import { buildHealthcheckRoute } from './healthcheck'

describe('healthcheckRoute', () => {
  let connectionManager;
  let gameManager;
  let healthcheckRoute;

  beforeEach(() => {
    connectionManager = {
      getConnectionCount: jest.fn()
    }
    gameManager = {
      getGameCount: jest.fn()
    }
    healthcheckRoute = buildHealthcheckRoute({ connectionManager, gameManager })
  })

  it('should have a root path', () => {
    expect(healthcheckRoute.path).toEqual('/healthcheck')
  })

  it('should have the name "healthcheck"', () => {
    expect(healthcheckRoute.name).toEqual('healthcheck')
  })

  it('should have method "get"', () => {
    expect(healthcheckRoute.method).toEqual('get')
  })

  describe('.requestHandler', () => {
    it('send the current number of connections to the response', () => {
      const response = { send: jest.fn() }
      connectionManager.getConnectionCount.mockReturnValue(217)
      healthcheckRoute.requestHandler(null, response)
      expect(response.send.mock.calls[0][0].connectionCount).toEqual(217)
    })

    it('send the current number of games to the response', () => {
      const response = { send: jest.fn() }
      gameManager.getGameCount.mockReturnValue(1432)
      healthcheckRoute.requestHandler(null, response)
      expect(response.send.mock.calls[0][0].gameCount).toEqual(1432)
    })
  })
})
