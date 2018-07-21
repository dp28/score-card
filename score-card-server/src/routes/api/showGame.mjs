import { log } from '../../logger.mjs'

export function buildShowGameRoute({ connectionManager, gameManager }) {
  return {
    path: '/api/games/:gameId',
    method: 'get',
    name: 'showGame',
    requestHandler: (request, response) => {
      const gameId = request.params.gameId
      log(`GET /api/games/${gameId}`)
      const game = gameManager.getCurrentGameState(gameId)
      if (game) {
        response.send(game)
      }
      else {
        response.status(404).send({
          success: false,
          error: 'Game not found'
        })
      }
    }
  }
}
