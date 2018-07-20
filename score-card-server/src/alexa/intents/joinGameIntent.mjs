import { ID_ADJECTIVES, ID_ANIMALS } from '../customSlots.mjs'
import { buildReadableList } from '../languageUtils.mjs'

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
    response.say(buildGameJoinedSummary(game, domain))
  } else {
    response.say(`I can't find a game with the identifier "${idDetection.input}"`)
  }
}

function buildGameJoinedSummary(game, domain) {
  const playerNames = domain.selectPlayerNames(game)
  const playersPhrase = buildPlayersPhrase(playerNames)
  console.log(game);
  const name = domain.selectGameName(game) || game.id
  return `Joined ${name}. ${playersPhrase}`
}

function buildPlayersPhrase(playerNames) {
  switch (playerNames.length) {
    case 0: return 'No players have been added yet.'
    case 1: return `${playerNames[0]} is the only player added so far.`
    default: {
      const playersReadableList = buildReadableList(playerNames)
      return `There are ${playerNames.length} players: ${playersReadableList}.`
    }
  }
}
