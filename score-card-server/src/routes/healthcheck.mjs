export function buildHealthcheckRoute({ connectionManager, gameManager }) {
  return {
    path: '/healthcheck',
    method: 'get',
    name: 'healthcheck',
    requestHandler: (_request, response) => {
      response.send({
        running: true,
        connectionCount: connectionManager.getConnectionCount(),
        gameCount: gameManager.getGameCount()
      })
    }
  }
}
