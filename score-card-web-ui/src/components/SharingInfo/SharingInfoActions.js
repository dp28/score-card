export const HIDE_SHARING = 'UI.HIDE_SHARING'

export function hideSharing({ gameId }) {
  return { type: HIDE_SHARING, uiOnly: true, gameId }
}
