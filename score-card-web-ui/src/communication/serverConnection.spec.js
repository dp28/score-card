import { ServerConnection } from './serverConnection'
import { connected, connecting, disconnected } from './serverConnectionEvents'

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
    global.WebSocket.CONNECTING = 0
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

    it('should not dispatch a connecting event because that is not allowed by redux', () => {
      new ServerConnection('fake', mockDispatch)
      expect(mockDispatch.mock.calls.length).toEqual(0)
    })
  })

  describe('if there is an error with the WebSocket connection', () => {
    const originalErrorLog = console.error
    beforeEach(() => { console.error = jest.fn() })
    afterEach(() => { console.error = originalErrorLog })

    it('should log an error', () => {
      new ServerConnection('fake', mockDispatch)
      mockWebSocketInstance.onerror({ data: 'bla"bla' })
      expect(console.error.mock.calls.length).toBe(1)
    })
  })

  describe('when the WebSocket connection opens', () => {
    it('should dispatch a connected event', () => {
      new ServerConnection('fake', mockDispatch)
      mockDispatch.mock.calls = []
      mockWebSocketInstance.onopen({ data: 'bla"bla' })
      expect(mockDispatch.mock.calls).toEqual([[connected()]])
    })
  })

  describe('if the WebSocket connection closes', () => {
    it('should dispatch a disconnected event', () => {
      new ServerConnection('fake', mockDispatch)
      mockDispatch.mock.calls = []
      mockWebSocketInstance.onclose({})
      expect(mockDispatch.mock.calls).toEqual([[disconnected()]])
    })
  })

  describe('receiving messages from the server', () => {
    let connection
    const originalErrorLog = console.error
    beforeEach(() => {
      connection = new ServerConnection('fake', mockDispatch)
      mockDispatch.mock.calls = []
      console.error = jest.fn()
    })
    afterEach(() => { console.error = originalErrorLog })

    describe('if they are not valid JSON', () => {
      it('should not dispatch them', () => {
        mockWebSocketInstance.onmessage({ data: 'bla"bla' })
        expect(mockDispatch.mock.calls.length).toBe(0)
      })

      it('should log an error', () => {
        mockWebSocketInstance.onmessage({ data: 'bla"bla' })
        expect(console.error.mock.calls.length).toBe(1)
      })
    })

    describe('if they are not valid events (do not have a type)', () => {
      it('should not dispatch them', () => {
        mockWebSocketInstance.onmessage({ data: '{}' })
        expect(mockDispatch.mock.calls.length).toBe(0)
      })

      it('should log an error', () => {
        mockWebSocketInstance.onmessage({ data: '{}' })
        expect(console.error.mock.calls.length).toBe(1)
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

    beforeEach(() => connection = new ServerConnection('fake', mockDispatch))

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
      beforeEach(() => mockWebSocketInstance.readyState = global.WebSocket.CONNECTING)

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

      describe('if the WebSocket is CLOSED', () => {
        beforeEach(() => mockWebSocketInstance.readyState = global.WebSocket.CLOSED)

        it('should try to reconnect', () => {
          mockDispatch.mock.calls = []
          connection.sendMessage({ a: 1 })
          expect(mockDispatch.mock.calls).toEqual([[connecting()]])
        })
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
