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
      const score = Number(request.slot('SCORE'))
      await withSavedGame({
        request,
        response,
        gameManager,
        params: { domain, playerName, score },
        calculateResponse
      })
    }
  }
}

async function calculateResponse({ game, score, gameManager, domain, playerName }) {
  const player = domain.selectPlayerByName(playerName, game)
  if (player) {
    return await recordScore({ score, player, game, gameManager, domain })
  }
  else {
    return `Sorry, I can't find a player called ${playerName} in this game.`
  }
}

async function recordScore({ score, player, game, gameManager, domain }) {
  const event = domain.recordScore({
    score,
    playerId: player.id,
    gameId: game.id
  })
  await gameManager.addGameEvent(event)
  const updatedGame = await gameManager.getCurrentGameState(game.id)
  const total = domain.selectPlayerTotal(player.id, updatedGame)
  return `After adding ${score}, ${player.name} now has ${total} points.`
}
