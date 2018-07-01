import { EDITING_GAME_NAME } from '../components/GameName/GameNameActions'
const INITITAL_STATE = { games: {}, ui: { games: {} } }

export const buildReducer = ({ domain }) => (state = INITITAL_STATE, event) => {
  const changeGames = event.hasOwnProperty('gameId') && !event.uiOnly
  const games = changeGames ? gamesReducer(domain.reducer, state.games, event) : state.games
  const ui = uiReducer(state.ui, event, domain)
  const hasChanged = ui !== state.ui || games !== state.games
  return hasChanged ? { games, ui } : state
}

function gamesReducer(gameReducer, games, event) {
  const gameId = event.gameId
  if (gameId) {
    return {
      ...games,
      [gameId]: gameReducer(games[gameId], event)
    }
  }
  return games
}

function uiReducer(state, event, { CHANGE_NAME }) {
  switch (event.type) {
    case EDITING_GAME_NAME: return changeUiGameName(state, event)
    case CHANGE_NAME: return removeUiGameName(state, event)
    default: return state
  }
}

function changeUiGameName(state, { type, gameId, gameName }) {
  const game = state.games[gameId] || {}
  return {
    ...state,
    games: {
      ...state.games,
      [gameId]: { ...game, name: gameName }
    }
  }
}

function removeUiGameName(state, { gameId }) {
  return changeUiGameName(state, { gameId, gameName: null })
}
