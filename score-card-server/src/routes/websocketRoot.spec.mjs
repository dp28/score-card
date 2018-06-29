import { buildWebsocketRootRoute } from './websocketRoot'

describe('websocketRootRoute', () => {
  let connectionManager;
  let gameManager;
  let websocketRootRoute;

  beforeEach(() => {
    connectionManager = {
      registerConnection: jest.fn(),
      getConnectionCount: () => 0
    }
    gameManager = {
      addGameEvent: jest.fn()
    }
    websocketRootRoute = buildWebsocketRootRoute({ connectionManager, gameManager })
  })

  it('should have a root path', () => {
    expect(websocketRootRoute.path).toEqual('/')
  })

  it('should have the name "websocketRoot"', () => {
    expect(websocketRootRoute.name).toEqual('websocketRoot')
  })

  it('should have a websocket method', () => {
    expect(websocketRootRoute.method).toEqual('ws')
  })

  describe('.requestHandler', () => {
    it('should register the passed-in connection with the ConnectionManager', () => {
      const connection = { a: 1, on: () => {} }
      websocketRootRoute.requestHandler(connection)
      expect(connectionManager.registerConnection.mock.calls).toEqual([[connection]])
    })

    it('should parse & forward received messages to the GameManager', () => {
      const connection = {
        on: (type, callback) => {
          if(type === 'message') {
            connection.send = callback
          }
        }
      }
      websocketRootRoute.requestHandler(connection)
      connection.send('{"a":1}')
      expect(gameManager.addGameEvent.mock.calls[0][0]).toEqual({ a: 1 })
    })

    it('should send messages to the GameManager with the connectionId from the ConnectionManager', () => {
      const connection = {
        on: (type, callback) => {
          if(type === 'message') {
            connection.send = callback
          }
        }
      }
      connectionManager.registerConnection.mockReturnValue('id123')
      websocketRootRoute.requestHandler(connection)
      connection.send('{"a":1}')
      expect(gameManager.addGameEvent.mock.calls[0][1]).toEqual('id123')
    })
  })
})
