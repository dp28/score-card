export class ServerConnection {

  constructor(url, dispatch) {
    this.dispatch = dispatch
    this.messageQueue = []
    this.connection = this.startConnection(url)
  }

  sendMessage(message) {
    if (message.receivedFromServer) {
      return
    }
    if (this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message))
    }
    else {
      this.messageQueue.push(message)
    }
  }

  startConnection(url) {
    const connection = new WebSocket(url)
    connection.onopen = this._flushQueuedMessages.bind(this)
    connection.onmessage = message => this._receiveMessage(message.data)
    connection.onerror = console.error
    return connection
  }

  _flushQueuedMessages() {
    this.messageQueue.forEach(this.sendMessage.bind(this))
    this.messageQueue = []
  }

  _receiveMessage(stringMessage) {
    try {
      const message = JSON.parse(stringMessage)
      if (message.hasOwnProperty('type')) {
        this.dispatch({ ...message, receivedFromServer: true })
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
