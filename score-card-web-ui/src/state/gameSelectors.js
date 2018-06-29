
export function selectGame(gameId, state) {
  return state.games[gameId]
}

export function selectPlayer(playerId, gameId, state) {
  console.log(state);
  return selectGame(gameId, state).players[playerId]
}
