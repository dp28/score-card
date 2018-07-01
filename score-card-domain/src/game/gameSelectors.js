export function selectTotals(game) {
  return Object.keys(game.players).map(playerId => ({
    playerName: game.players[playerId].name,
    total: game.totals[playerId]
  }))
}

export function selectTotalForPlayerName(playerName, game) {
  const player = selectPlayerByName(playerName, game)
  return player ? game.totals[player.id] : null
}

function selectPlayerByName(playerName, game) {
  console.log(Object.values(game.players));
  const player = Object.values(game.players).find(player => (
    player.name.toLowerCase() === playerName.toLowerCase()
  ))
  return player ? player : null
}

export function selectGameName(game) {
  return game.name
}


export function selectPlayerNames(game) {
  return Object.values(game.players).map(player => player.name)
}
