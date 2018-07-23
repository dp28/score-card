export async function withSavedGame({ request, response, gameManager, params, calculateResponse }) {
  const session = request.getSession()
  const clientId = request.userId
  const game = await findGame({ session, clientId, gameManager, response })
  if (game) {
    await runWithinGame({ game, gameManager, params, calculateResponse, clientId, response })
  }
  else {
    response.shouldEndSession(false)
    response.say(
      `You haven't joined a game yet. Which game would you like to join?`
    )
    response.reprompt('Which game would you like to join?')
  }
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
      const readableId = sessionGameId.replace('-', ' ')
      response.say(
        `Sorry, I can't find a game with the ID "${readableId}". Which game would you like to join?`
      )
    }
    return game
  }
  return null
}

async function runWithinGame({ game, gameManager, params, calculateResponse, clientId, response }) {
  return await calculateResponse(Object.assign({ game, gameManager, clientId, response }, params))
}
