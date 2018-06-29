import { ServerConnection } from './serverConnection'

describe('ServerConnection', () => {
  let originalWebSocket = global.WebSocket
  let mockWebSocketClass;
  let mockWebSocketInstance;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn()
    mockWebSocketInstance = {
      send: jest.fn()
    }
    mockWebSocketClass = function(...constructorArgs) {
      mockWebSocketInstance.constructorArgs = constructorArgs
      return mockWebSocketInstance
    }
    global.WebSocket = mockWebSocketClass
    global.WebSocket.OPEN = 1
    global.WebSocket.CLOSED = 3
    mockWebSocketInstance.readyState = global.WebSocket.OPEN
  })

  afterEach(() => global.WebSocket = originalWebSocket)

  describe('construction', () => {
    it('should create a new WebSocket to the passed-in URL', () => {
      new ServerConnection('ws://bla.test', () => {})
      expect(mockWebSocketInstance.constructorArgs[0]).toEqual('ws://bla.test')
    })
  })

  describe('receiving messages from the server', () => {
    let connection;

    beforeEach(() => connection = new ServerConnection('fake', mockDispatch))

    describe('if they are not valid JSON', () => {
      it('should not dispatch them', () => {
        mockWebSocketInstance.onmessage({ data: 'bla"bla' })
        expect(mockDispatch.mock.calls.length).toBe(0)
      })
    })

    describe('if they are not valid events (do not have a type)', () => {
      it('should not dispatch them', () => {
        mockWebSocketInstance.onmessage({ data: '{}' })
        expect(mockDispatch.mock.calls.length).toBe(0)
      })
    })

    describe('if they are stringified valid events (do have a type)', () => {
      it('should dispatch them, adding a "receivedFromServer" property', () => {
        mockWebSocketInstance.onmessage({ data: '{"type": "something"}' })
        expect(mockDispatch.mock.calls).toEqual([
          [{ type: 'something', receivedFromServer: true }]
        ])
      })
    })
  })

  describe('#sendMessage', () => {
    let connection;

    beforeEach(() => connection = new ServerConnection('fake', () => {}))

    it('should send a string to the underlying WebSocket', () => {
      connection.sendMessage({ a: 1 })
      expect(mockWebSocketInstance.send.mock.calls[0][0]).toEqual('{"a":1}')
    })

    describe('if the message was received from the server', () => {
      it('should not send the message', () => {
        connection.sendMessage({ a: 1, receivedFromServer: true })
        expect(mockWebSocketInstance.send.mock.calls.length).toEqual(0)
      })
    })

    describe('if the WebSocket is not OPEN', () => {
      beforeEach(() => mockWebSocketInstance.readyState = global.WebSocket.CLOSED)

      it('should not send the message', () => {
        connection.sendMessage({ a: 1 })
        expect(mockWebSocketInstance.send.mock.calls.length).toEqual(0)
      })

      it('should send the message when the WebSocket becomes open', () => {
        connection.sendMessage({ a: 1 })
        mockWebSocketInstance.readyState = global.WebSocket.OPEN
        mockWebSocketInstance.onopen()
        expect(mockWebSocketInstance.send.mock.calls[0][0]).toEqual('{"a":1}')
      })

      describe('if there are multiple messages sent while the connection is not open', () => {
        it('should send them all in order when it becomes open', () => {
          connection.sendMessage({ a: 1 })
          connection.sendMessage({ b: 2 })
          mockWebSocketInstance.readyState = global.WebSocket.OPEN
          mockWebSocketInstance.onopen()
          expect(mockWebSocketInstance.send.mock.calls).toEqual([
            ['{"a":1}'],
            ['{"b":2}']
          ])
        })

        describe('if the connection opens, then closes, then opens again', () => {
          it('should only send the messages which have not been sent already', () => {
            connection.sendMessage({ a: 1 })
            mockWebSocketInstance.readyState = global.WebSocket.OPEN
            mockWebSocketInstance.onopen()
            expect(mockWebSocketInstance.send.mock.calls).toEqual([
              ['{"a":1}']
            ])

            mockWebSocketInstance.readyState = global.WebSocket.CLOSED
            mockWebSocketInstance.send.mock.calls = []
            connection.sendMessage({ b: 2 })
            mockWebSocketInstance.readyState = global.WebSocket.OPEN
            mockWebSocketInstance.onopen()
            expect(mockWebSocketInstance.send.mock.calls).toEqual([
              ['{"b":2}']
            ])
          })
        })
      })
    })
  })
})
