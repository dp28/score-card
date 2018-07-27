import { persistStateMiddleware } from './persistState'
import { CONNECTED, connected } from '../communication/serverConnectionEvents'

describe('persistState', () => {
  let mockStore
  let mockNext
  let dependencies

  beforeEach(() => {
    dependencies = {
      domain: {
        isEqualJoinGameEvent: jest.fn()
      },
      storage: {
        setItem: jest.fn(() => Promise.resolve(null)),
        getItem: jest.fn(() => Promise.resolve(null))
      }
    }
    mockStore = {
      dispatch: jest.fn()
    }
    mockNext = jest.fn()
  })

  const oneEventLoopCycle = () => Promise.resolve()
  const waitForCall = async (mockFunction) => {
    while (mockFunction.mock.calls.length === 0) {
      await oneEventLoopCycle()
    }
  }
  const mockOutStoredEvents = events => {
    dependencies.storage.getItem.mockReturnValue(Promise.resolve(events))
  }

  describe('when starting', () => {
    it('asyncronously dispatches all the events in the storage dependency in order', async () => {
      const events = [{ a: 1 }, { b: 2 }]
      mockOutStoredEvents (events)
      persistStateMiddleware(dependencies)(mockStore)
      await waitForCall(mockStore.dispatch)
      return expect(mockStore.dispatch.mock.calls).toEqual(events.map(e => [e]))
    })

    it('fetches the events using the correct key', async () => {
      persistStateMiddleware(dependencies)(mockStore)
      await waitForCall(dependencies.storage.getItem)
      return expect(dependencies.storage.getItem.mock.calls).toEqual([['EVENTS']])
    })

    it('does not dispatch anything if no events have been saved', async () => {
      mockOutStoredEvents (null)
      persistStateMiddleware(dependencies)(mockStore)
      await oneEventLoopCycle()
      return expect(mockStore.dispatch.mock.calls.length).toEqual(0)
    })
  })

  describe('when an event is passed', () => {
    it('should call "next"', () => {
      persistStateMiddleware(dependencies)(mockStore)(mockNext)({})
      expect(mockNext.mock.calls.length).toEqual(1)
    })

    describe('and the event is a non-ui game event that has not been sent before', () => {
      const event = { id: 'unique1', gameId: 'fake' }
      const otherEvent = { id: 'unique2', gameId: 'fake' }

      beforeEach(() => { dependencies.domain.isEqualJoinGameEvent = () => false })

      describe('and no others have been passed so far', () => {
        it('should be persisted in an array', async () => {
          persistStateMiddleware(dependencies)(mockStore)(mockNext)(event)
          await waitForCall(dependencies.storage.setItem)
          expect(dependencies.storage.setItem.mock.calls).toEqual([['EVENTS', [event]]])
        })
      })

      describe('and others have been passed so far', () => {
        it('should persist all of them in order', async () => {
          const middleware = persistStateMiddleware(dependencies)(mockStore);
          middleware(mockNext)(event)
          await waitForCall(dependencies.storage.setItem)
          expect(dependencies.storage.setItem.mock.calls).toEqual([['EVENTS', [event]]])
          middleware(mockNext)(otherEvent)
          await waitForCall(dependencies.storage.setItem)
          return expect(dependencies.storage.setItem.mock.calls[1]).toEqual(
            ['EVENTS', [event, otherEvent]]
          )
        })
      })

      describe(`when it is a ${CONNECTED} event`, () => {
        it('dispatches all the events in the storage dependency in order', async () => {
          const events = [event, otherEvent]
          mockOutStoredEvents(events)
          const middleware = persistStateMiddleware(dependencies)(mockStore)
          await waitForCall(mockStore.dispatch)
          mockStore.dispatch.mock.calls = []
          middleware(mockNext)(connected())
          await waitForCall(mockStore.dispatch)
          return expect(mockStore.dispatch.mock.calls).toEqual(events.map(e => [e]))
        })
      })
    })
  })
})
