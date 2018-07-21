import alexa from 'alexa-app'

import { addCustomSlots } from './customSlots.mjs'
import { registerIntents } from './intents/register.mjs'

export function buildAlexaApp({ gameManager }) {
  const alexaApp = new alexa.app('score-card')

  alexaApp.launch(async (request, response) => {
    const game = await fetchMostRecentGame(request.userId, gameManager)
    if (game) {
      response.say('Rejoined your game')
    } else {
      response.say('Which game would you like to join?')
    }
    response.shouldEndSession(false)
  })

  addCustomSlots(alexaApp)
  registerIntents({ alexaApp, gameManager })

  return alexaApp
}

async function fetchMostRecentGame(clientId, gameManager) {
  if (clientId) {
    return await gameManager.getMostRecentGameForClientId(clientId)
  }
  return null
}

export function mountAlexaApp({ expressApp, gameManager }) {
  const alexaApp = buildAlexaApp({ gameManager })
  alexaApp.express({ expressApp, debug: true, endpoint: '/alexa/score-card' })
}
