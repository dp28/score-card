import { buildReadableList } from '../languageUtils.mjs'
import { withSavedGame } from './sessionUtils.mjs'

export function buildGetTotalsIntent({ gameManager, domain }) {
  return {
    name: 'GetTotalsIntent',
    schema: {
      slots: {},
      utterances: [
        'what is the current score',
        'what are the scores',
        'what are the scores on the doors',
        'what\'s the score',
        'what is the score',
        'what are the totals',
        'what are the totals',
        'what is the total',
        'what is the damage',
        'read the score',
        'tell me the score',
        'tell me the scores',
        'tell us the scores',
      ]
    },
    requestHandler: async (request, response) => {
      await withSavedGame({
        request,
        response,
        gameManager,
        params: { domain },
        calculateResponse
      })
    }
  }
}

function calculateResponse({ game, domain, response }) {
  response.shouldEndSession(true)
  response.say(
    [
      `The current total scores are`,
      buildCurrentScoresSentence(game, domain)
    ].join(' ')
  )
}

function buildCurrentScoresSentence(game, domain) {
  const totals = domain.selectTotals(game)
  const statements = totals.map(({ playerName, total }) => (
    `${playerName} has ${total} points`
  ))
  const sentence = buildReadableList(statements)
  return sentence || 'unavailable as their are no players in the game.'
}
