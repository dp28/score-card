export async function withSavedGame({ request, response, gameManager, params, calculateResponse }) {
  const session = request.getSession()
  const clientId = request.userId
  const game = await findGame({ session, clientId, gameManager, response })
  if (game) {
    response.say(await runWithinGame({ game, gameManager, params, calculateResponse, clientId }))
  }
  else {
    response.say(
      `You haven't joined a game yet. To do so, say "join game ID". A game ID is
      normally an adjective, an animal and a number, for example "old goose 17"`
    )
  }
  response.shouldEndSession(false)
}

async function findGame({ session, clientId, gameManager, response }) {
  return (
    (await findGameFromSession({ session, gameManager, response })) ||
    await gameManager.getMostRecentGameForClientId(clientId)
  )
}

async function findGameFromSession({ session, gameManager, response }) {
  const sessionGameId = session.get('gameId')
  if (sessionGameId) {
    const game = await gameManager.getCurrentGameState(sessionGameId)
    if (!game) {
      response.say(`Sorry, I can't find a game with the ID "${sessionGameId.replace('-', ' ')}".`)
    }
    return game
  }
  return null
}

async function runWithinGame({ game, gameManager, params, calculateResponse, clientId }) {
  return await calculateResponse(Object.assign({ game, gameManager, clientId }, params))
}
