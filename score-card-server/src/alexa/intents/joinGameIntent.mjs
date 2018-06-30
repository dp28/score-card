import { ID_ADJECTIVES, ID_ANIMALS } from '../customSlots.mjs'

const ID_FORMAT = '{-|ADJECTIVE} {-|ANIMAL} {-|NUMBER}'

export function buildJoinGameIntent({ gameManager, domain }) {
  return {
    name: 'JoinGameIntent',
    schema: {
      slots: {
        ADJECTIVE: ID_ADJECTIVES,
        ANIMAL: ID_ANIMALS,
        NUMBER: "AMAZON.NUMBER"
      },
      utterances: [
        ID_FORMAT,
        `join ${ID_FORMAT}`,
        `join game ${ID_FORMAT}`,
      ]
    },
    requestHandler: (request, response) => {
      const idDetection = findIdInput(request)
      if (idDetection.valid) {
        findGame({ idDetection, request, response, gameManager, domain })
      }
      else {
        response.say(`Sorry, that didn't seem to be a valid game id`)
      }
      response.shouldEndSession(false)
    }
  }
}

function findIdInput(request) {
  const adjective = request.slot('ADJECTIVE')
  const animal = request.slot('ANIMAL')
  const number = request.slot('NUMBER')
  const valid = animal && adjective && number
  return {
    valid,
    input: [adjective, animal, number].join(' '),
    value: [adjective, animal, number].join('-')
  }
}

function findGame({ request, response, gameManager, idDetection, domain }) {
  const game = gameManager.getCurrentGameState(idDetection.value)
  if (game) {
    request.getSession().set('gameId', idDetection.value)
    response.say(`The current total scores are`)
    response.say(buildCurrentScoresSentence(game, domain))
  } else {
    response.say(`I can't find a game with the id "${idDetection.input}"`)
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
