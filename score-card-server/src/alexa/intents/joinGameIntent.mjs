import { ID_ADJECTIVES, ID_ANIMALS } from '../customSlots.mjs'

const ID_FORMAT = '{-|ADJECTIVE} {-|ANIMAL} {-|NUMBER}'

export function buildJoinGameIntent({ gameManager }) {
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
        findGame({ idDetection, response, gameManager })
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

function findGame({ response, gameManager, idDetection }) {
  const game = gameManager.getCurrentGameState(idDetection.value)
  if (game) {
    response.say(`Found it`)
  } else {
    response.say(`I can't find a game with the id "${idDetection.input}"`)
  }
}
