import express from 'express'
import expressWebsockets from 'express-ws'
import * as path from 'path'

import Config from './config'

import { ConnectionManager } from './connectionManager.mjs'
import { GameManager } from './gameManager.mjs'
import { mountRoutes } from './routes/index.mjs'
import { mountAlexaApp } from './alexa/index.mjs'
import { log } from './logger.mjs'

const ServerPort = process.env.PORT || Config.PORT
const app = express()
expressWebsockets(app)

const connectionManager = new ConnectionManager()
const gameManager = new GameManager(connectionManager.sendToConnection.bind(connectionManager))

mountRoutes({ app, connectionManager, gameManager })
mountAlexaApp({ gameManager, expressApp: app })

if (process.env.NODE_ENV === 'production') {
  log('Serving static assets')
  const staticWebUiPath = path.join(__dirname, 'deployment-only/web-ui')
  app.use(express.static(staticWebUiPath))

  app.get('/*', (_request, response) => {
    response.sendFile(path.join(staticWebUiPath, 'index.html'))
  })
}

app.listen(ServerPort)
log(`Running at localhost:${ServerPort}`)
