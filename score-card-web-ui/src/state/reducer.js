import { EDITING_GAME_NAME } from '../components/GameName/GameNameActions'
import { SHARE_GAME } from '../components/ShareButton/ShareButtonActions'
import { HIDE_SHARING } from '../components/SharingInfo/SharingInfoActions'

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

function uiReducer(state, event, domain) {
  const gameId = event.gameId
  if (gameId) {
    return {
      ...state,
      games: {
        ...state.games,
        [gameId]: uiGameReducer(state.games[gameId] || {}, event, domain)
      }
    }
  }
  return state
}

function uiGameReducer(game, event, { CHANGE_NAME }) {
  switch (event.type) {
    case EDITING_GAME_NAME: return changeUiGameName(game, event)
    case CHANGE_NAME: return removeUiGameName(game, event)
    case SHARE_GAME: return { ...game, sharing: true }
    case HIDE_SHARING: return { ...game, sharing: false }
    default: return game
  }
}

function changeUiGameName(game, { type, gameId, gameName }) {
  return { ...game, name: gameName }
}

function removeUiGameName(game, { gameId }) {
  return { ...game, name: null }
}
