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
    requestHandler: (request, response) => {
      const gameId = request.getSession().get('gameId')
      if (gameId) {
        response.say(getTotalsForGame({ gameId, gameManager, domain }))
      }
      else {
        response.say(
          `You haven't joined a game yet. To do so, say "join game id". Game ids
          are normally an adjective, an animal and a number, for example
          "old goose 17"`
        )
      }
      response.shouldEndSession(false)
    }
  }
}

function getTotalsForGame({ gameId, gameManager, domain }) {
  const game = gameManager.getCurrentGameState(gameId)
  if (game) {
    return [
      `The current total scores are`,
      buildCurrentScoresSentence(game, domain)
    ].join(' ')
  }
  else {
    return `I can't find a game with the id "${gameId.replace('-', ' ')}"`
  }
}

function buildCurrentScoresSentence(game, domain) {
  const totals = domain.selectTotals(game)
  const statements = totals.map(({ playerName, total }) => (
    `${playerName} has ${total} points`
  ))

  switch (statements.length) {
    case 0: return 'unavailable as their are no players in the game.'
    case 1: return statements[0]
    default: return buildReadableLongList(statements)
  }
}

function buildReadableLongList(statements) {
  const lastTwoStatements = statements.slice(statements.length - 2)
  const firstStatements = statements.slice(0, statements.length - 2)
  const start = firstStatements.map(statement => `${statement}, `).join('')
  const end = lastTwoStatements.join(' and ')
  return start + end
}
