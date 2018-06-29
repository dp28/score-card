import { mountRoutes } from './index.mjs'
import { buildWebsocketRootRoute } from './websocketRoot.mjs'
import { buildHealthcheckRoute } from './healthcheck.mjs'
import { buildCreateEventRoute } from './api/createEvent.mjs'

describe('mountRoutes', () => {
  const connectionManager = null
  const gameManager = null
  let app;

  beforeEach(() => {
    app = {
      get: jest.fn(),
      post: jest.fn(),
      ws: jest.fn(),
    }
  });

  [
    buildWebsocketRootRoute,
    buildHealthcheckRoute,
    buildCreateEventRoute
  ].forEach(builder => {

    const root = builder({ connectionManager, gameManager })

    describe(`${root.name} route`, () => {
      it(`should be mounted at "${root.path}" with the method "${root.method}"`, () => {
        mountRoutes({ app, connectionManager, gameManager })
        const mountsAtCorrectPathAndMethod = app[root.method].mock.calls.filter(
          ([path]) => path === root.path
        )
        expect(mountsAtCorrectPathAndMethod.length).toBe(1)
      })
    })
  })
})
