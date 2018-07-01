export const EDITING_GAME_NAME = 'UI.EDITING_GAME_NAME'

export function editingGameName({ gameId, gameName }) {
  return { type: EDITING_GAME_NAME, uiOnly: true, gameId, gameName }
}
