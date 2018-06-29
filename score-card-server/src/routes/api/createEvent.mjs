export function buildCreateEventRoute({ connectionManager, gameManager }) {
  return {
    path: '/api/events',
    method: 'post',
    name: 'createEvent',
    requestHandler: (request, response) => {
      console.log('POST /api/events')

      const event = request.body
      if (typeof event.gameId === 'string') {
        gameManager.addGameEvent(request.body)
        response.send({
          success: true
        })
      }
      else {
        response.status(400).send({
          success: false,
          error: 'Invalid event'
        })
      }
    }
  }
}
