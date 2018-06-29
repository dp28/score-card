export function buildWebsocketRootRoute({ connectionManager, gameManager }) {
  return {
    path: '/',
    method: 'ws',
    name: 'websocketRoot',
    requestHandler: connection => {
      const connectionId = connectionManager.registerConnection(connection)

      connection.on('message', rawMessage => {
        const jsonMessage = JSON.parse(rawMessage)
        gameManager.addGameEvent(jsonMessage, connectionId)
      })

      connection.on('close', () => {
        console.log(`Client disconnected - ${connectionManager.getConnectionCount()} left`);
      });
    }
  }
}
