import * as domain from '../../score-card-domain.mjs'

import { buildJoinGameIntent } from './joinGameIntent.mjs'
import { buildRecordScoreIntent } from './recordScoreIntent.mjs'
import { buildGetTotalsIntent } from './getTotalsIntent.mjs'
import { buildHelpIntent } from './helpIntent.mjs'
import { buildStopIntent, buildCancelIntent } from './stopIntents.mjs'

const INTENT_BUILDERS = [
  buildJoinGameIntent,
  buildRecordScoreIntent,
  buildGetTotalsIntent,
  buildHelpIntent,
  buildStopIntent,
  buildCancelIntent
]

export function registerIntents({ alexaApp, gameManager }) {
  INTENT_BUILDERS.forEach(buildIntent => {
    const { name, schema, requestHandler } = buildIntent({ gameManager, domain })
    alexaApp.intent(name, schema, requestHandler)
  })
}
