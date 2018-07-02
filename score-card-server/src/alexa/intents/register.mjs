import * as domain from '../../score-card-domain.mjs'

import { buildJoinGameIntent } from './joinGameIntent.mjs'
import { buildRecordScoreIntent } from './recordScoreIntent.mjs'
import { buildGetTotalsIntent } from './getTotalsIntent.mjs'

const INTENT_BUILDERS = [
  buildJoinGameIntent,
  buildRecordScoreIntent,
  buildGetTotalsIntent
]

export function registerIntents({ alexaApp, gameManager }) {
  INTENT_BUILDERS.forEach(buildIntent => {
    const { name, schema, requestHandler } = buildIntent({ gameManager, domain })
    alexaApp.intent(name, schema, requestHandler)
  })
}
