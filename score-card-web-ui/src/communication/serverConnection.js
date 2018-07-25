import { connected, connecting, disconnected } from './serverConnectionEvents'

export class ServerConnection {

  constructor(url, dispatch) {
    this._dispatch = dispatch
    this._messageQueue = []
    this._url = url
    this._startConnection()
  }

  sendMessage(message) {
    if (message.receivedFromServer) {
      return
    }
    if (this._connection.readyState === WebSocket.OPEN) {
      this._connection.send(JSON.stringify(message))
    } else {
      this._messageQueue.push(message)

      if (this._connection.readyState === WebSocket.CLOSED) {
        this._startConnection()
        this._dispatch(connecting())
      }
    }
  }

  _startConnection() {
    this._connection = new WebSocket(this._url)
    this._connection.onopen = this._onConnected.bind(this)
    this._connection.onclose = this._onDisconnected.bind(this)
    this._connection.onmessage = message => this._receiveMessage(message.data)
    this._connection.onerror = console.error
  }

  _onConnected() {
    this._dispatch(connected())
    this._flushQueuedMessages()
  }

  _onDisconnected() {
    this._dispatch(disconnected())
  }

  _flushQueuedMessages() {
    this._messageQueue.forEach(this.sendMessage.bind(this))
    this._messageQueue = []
  }

  _receiveMessage(stringMessage) {
    try {
      const message = JSON.parse(stringMessage)
      if (message.hasOwnProperty('type')) {
        this._dispatch({ ...message, receivedFromServer: true })
      }
      else {
        console.error('Non event received from server', message)
      }
    }
    catch (error) {
      console.error('Invalid JSON received from server', stringMessage, error);
    }
  }
}
