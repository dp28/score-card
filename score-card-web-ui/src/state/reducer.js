
const INITITAL_STATE = { games: {} }

export const buildReducer = gameReducer => (state = INITITAL_STATE, event) => {
  if (event.hasOwnProperty('gameId')) {
    return {
      ...state,
      games: gameMapReducer(gameReducer, state.games, event)
    }
  }
  return state
}


function gameMapReducer(gameReducer, games, event) {
  const gameId = event.gameId
  if (gameId) {
    return {
      ...games,
      [gameId]: gameReducer(games[gameId], event)
    }
  }
  return games
}
