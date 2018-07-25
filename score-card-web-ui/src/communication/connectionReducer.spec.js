import { connectionReducer } from './connectionReducer'
import {
  CONNECTED,
  connected,
  CONNECTING,
  connecting,
  DISCONNECTED,
  disconnected
} from './serverConnectionEvents'

describe('connectionReducer', () => {
  describe('without any state', () => {
    it('should return the "connecting" status', () => {
      expect(connectionReducer(undefined, { type: 'any' })).toEqual({
        status: 'connecting'
      })
    })
  })

  describe('when passing an unknown event type', () => {
    it('should return the state without any changes', () => {
      const state = { a: 1 }
      expect(connectionReducer(state, { type: 'unknown' })).toBe(state)
    })
  })

  describe(`when passing a '${CONNECTED}' event`, () => {
    it('should return a status set to "connected"', () => {
      expect(connectionReducer({}, connected())).toEqual({
        status: 'connected'
      })
    })
  })

  describe(`when passing a '${CONNECTING}' event`, () => {
    it('should return a status set to "connecting"', () => {
      expect(connectionReducer({}, connecting())).toEqual({
        status: 'connecting'
      })
    })
  })

  describe(`when passing a '${DISCONNECTED}' event`, () => {
    it('should return a status set to "disconnected"', () => {
      expect(connectionReducer({}, disconnected())).toEqual({
        status: 'disconnected'
      })
    })
  })
})
