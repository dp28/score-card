import alexa from 'alexa-app'

import { addCustomSlots } from './customSlots.mjs'
import { registerIntents } from './intents/register.mjs'

export function buildAlexaApp({ gameManager }) {
  const alexaApp = new alexa.app('score-card')

  alexaApp.launch((request, response) => {
    response.say('Which game would you like to join?')
    response.shouldEndSession(false)
  })

  addCustomSlots(alexaApp)
  registerIntents({ alexaApp, gameManager })

  return alexaApp
}

export function mountAlexaApp({ expressApp, gameManager }) {
  const alexaApp = buildAlexaApp({ gameManager })
  alexaApp.express({ expressApp, debug: true, endpoint: '/alexa/score-card' })
}
