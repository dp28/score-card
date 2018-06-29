import { buildWebsocketRootRoute } from './websocketRoot.mjs'
import { buildHealthcheckRoute } from './healthcheck.mjs'
import { buildCreateEventRoute } from './api/createEvent.mjs'

const RouteBuilders = [
  buildWebsocketRootRoute,
  buildHealthcheckRoute,
  buildCreateEventRoute
]

export function mountRoutes({ app, connectionManager, gameManager }) {
  RouteBuilders
    .map(builder => builder({ connectionManager, gameManager }))
    .forEach(root => {
      app[root.method](root.path, root.requestHandler)
    })
}
