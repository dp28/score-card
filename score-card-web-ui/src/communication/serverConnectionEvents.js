export const CONNECTED = 'CONNECTED'
export const CONNECTING = 'CONNECTING'
export const DISCONNECTED = 'DISCONNECTED'

export const connected = () => ({ type: CONNECTED, uiOnly: true })
export const connecting = () => ({ type: CONNECTING, uiOnly: true })
export const disconnected = () => ({ type: DISCONNECTED, uiOnly: true })
