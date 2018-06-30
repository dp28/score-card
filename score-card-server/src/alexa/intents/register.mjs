import { buildJoinGameIntent } from './joinGameIntent.mjs'

const INTENT_BUILDERS = [
  buildJoinGameIntent
]

export function registerIntents({ alexaApp, gameManager }) {
  INTENT_BUILDERS.forEach(buildIntent => {
    const { name, schema, requestHandler } = buildIntent({ gameManager })
    alexaApp.intent(name, schema, requestHandler)
  })
}
