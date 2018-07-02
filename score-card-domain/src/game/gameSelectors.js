import { get as calculateDistance } from 'fast-levenshtein'

export function selectTotals(game) {
  return Object.keys(game.players).map(playerId => ({
    playerName: game.players[playerId].name,
    total: game.totals[playerId]
  }))
}

export function selectPlayerTotal(playerId, game) {
  return game.totals[playerId]
}

export function selectTotalForPlayerName(playerName, game) {
  const player = selectPlayerByName(playerName, game)
  return player ? game.totals[player.id] : null
}

export function selectGameName(game) {
  return game.name
}

export function selectPlayerNames(game) {
  return Object.values(game.players).map(player => player.name)
}

export function selectPlayerByName(playerName, game) {
  const player = selectPlayerByExactName(playerName, game)
  if (player) {
    return player
  }
  else {
    const closestName = selectSimilarPlayerName(playerName, game)
    return selectPlayerByExactName(closestName, game)
  }
}

function selectPlayerByExactName(playerName, game) {
  if (!playerName) {
    return null
  }
  const player = Object.values(game.players).find(player => (
    player.name.toLowerCase() === playerName.toLowerCase()
  ))
  return player ? player : null
}

function selectSimilarPlayerName(possibleName, game) {
  const orderedMatches = selectPlayerNames(game)
    .map(name => ({ name, similarity: estimateSimilarityRatio(name, possibleName) }))
    .filter(result => result.similarity > 0.66)
    .sort((a, b) => a.similarity - b.similarity)
  return orderedMatches.length ? orderedMatches[0].name : null
}

// 1 = same word, 0 = completely different
function estimateSimilarityRatio(word, otherWord) {
  const distance = calculateDistance(word, otherWord)
  return 1 - (distance / word.length)
}
