export const SHARE_GAME = 'UI.SHARE_GAME'

export function shareGame({ gameId }) {
  return { type: SHARE_GAME, uiOnly: true, gameId }
}
