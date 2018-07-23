import { withSavedGame } from './sessionUtils.mjs'

export function buildRecordScoreIntent({ gameManager, domain }) {
  return {
    name: 'RecordScoreIntent',
    schema: {
      slots: {
        PLAYER: 'AMAZON.FirstName',
        SCORE: 'AMAZON.NUMBER'
      },
      utterances: [
        'add {-|SCORE} for {-|PLAYER}',
        'add {-|SCORE} to {-|PLAYER} score',
        'add {-|SCORE} to {-|PLAYER} total',
        '{-|SCORE} for {-|PLAYER}',
        '{-|SCORE} to {-|PLAYER}',
        '{-|SCORE} points for {-|PLAYER}',
        '{-|SCORE} points to {-|PLAYER}',
        'add {-|SCORE} points for {-|PLAYER}',
        '{-|PLAYER} got {-|SCORE} points',
        '{-|PLAYER} got {-|SCORE}',
        '{-|PLAYER} scored {-|SCORE}',
      ]
    },
    requestHandler: async (request, response) => {
      const playerName = request.slot('PLAYER')
      const score = request.slot('SCORE')
      if (validatePlayerName(response, playerName) && validateScore(response, score)) {
        await withSavedGame({
          request,
          response,
          gameManager,
          params: { domain, playerName, score: Number(score) },
          calculateResponse
        })
      }
    }
  }
}

async function calculateResponse({ game, score, gameManager, domain, playerName, clientId, response }) {
  response.shouldEndSession(false)
  response.reprompt(`
    You can add scores or hear the current scores. What would you like to do?`
  )
  const player = domain.selectPlayerByName(playerName, game)
  if (player) {
    response.say(
      await recordScore({ score, player, game, gameManager, domain, clientId })
    )
  }
  else {
    response.say(
      `Sorry, I can't find a player called ${playerName} in this game.
      Please try again.`
    )
  }
}

async function recordScore({ score, player, game, gameManager, domain, clientId }) {
  const event = domain.recordScore({
    score,
    clientId,
    playerId: player.id,
    gameId: game.id
  })
  await gameManager.addGameEvent(event)
  const updatedGame = await gameManager.getCurrentGameState(game.id)
  const total = domain.selectPlayerTotal(player.id, updatedGame)
  return `After adding ${score}, ${player.name} now has ${total} points. Anything else?`
}

function validatePlayerName(response, playerName) {
  if (playerName) {
    return true
  }
  return failValidation(response, 'I couldn\'t work out which player that was for.')
}

function validateScore(response, score) {
  if (score || score === '0' || score == 0) {
    return true
  }
  return failValidation(response, 'I couldn\'t work out how many points to add.')
}

function failValidation(response, error) {
  response.say(`${error} Please try again.`)
  response.shouldEndSession(false)
  response.reprompt(`
    You can add scores or hear the current scores. What would you like to do?`
  )
  return false
}
