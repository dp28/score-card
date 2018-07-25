
export function selectGame(gameId, state) {
  return state.games[gameId]
}

export function selectPlayer(playerId, gameId, state) {
  return selectGame(gameId, state).players[playerId]
}
