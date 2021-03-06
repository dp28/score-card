import { joinGame } from '../domainEvents'

export function dispatchEventsFromPathState(dispatch, path) {
  const pathParts = path.split('/')
  if (pathParts[1] === 'games' && Boolean(pathParts[2])) {
    dispatch(joinGame({ gameId: pathParts[2] }))
  }
}
