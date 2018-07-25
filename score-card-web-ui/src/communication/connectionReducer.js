import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED
} from './serverConnectionEvents'

export const CONNECTING_STATUS = 'connecting'
export const CONNECTED_STATUS = 'connected'
export const DISCONNECTED_STATUS = 'disconnected'

export function connectionReducer(state = { status: CONNECTING_STATUS }, event) {
  switch (event.type) {
    case CONNECTED: return { ...state, status: CONNECTED_STATUS }
    case CONNECTING: return { ...state, status: CONNECTING_STATUS }
    case DISCONNECTED: return { ...state, status: DISCONNECTED_STATUS }
    default: return state
  }
}
