export async function withSavedGame({ request, response, gameManager, params, calculateResponse }) {
  const gameId = request.getSession().get('gameId')
  if (gameId) {
    response.say(await runWithinGame({ gameId, gameManager, params, calculateResponse }))
  }
  else {
    response.say(
      `You haven't joined a game yet. To do so, say "join game id". A game id is
      normally an adjective, an animal and a number, for example "old goose 17"`
    )
  }
  response.shouldEndSession(false)
}

async function runWithinGame({ gameId, gameManager, params, calculateResponse }) {
  const game = await gameManager.getCurrentGameState(gameId)
  if (game) {
    return await calculateResponse(Object.assign({ game, gameManager }, params))
  }
  else {
    return `Sorry, I can't find a game with the id "${gameId.replace('-', ' ')}".`
  }
}
