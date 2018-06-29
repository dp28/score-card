import { buildWebsocketRootRoute } from './websocketRoot.mjs'
import { buildHealthcheckRoute } from './healthcheck.mjs'
import { buildCreateEventRoute } from './api/createEvent.mjs'
import { buildShowGameRoute } from './api/showGame.mjs'

const RouteBuilders = [
  buildWebsocketRootRoute,
  buildHealthcheckRoute,
  buildCreateEventRoute,
  buildShowGameRoute
]

export function mountRoutes({ app, connectionManager, gameManager }) {
  RouteBuilders
    .map(builder => builder({ connectionManager, gameManager }))
    .forEach(root => {
      app[root.method](root.path, root.requestHandler)
    })
}
