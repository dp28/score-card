import { createStore, applyMiddleware, compose } from 'redux'
import * as domain from '../score-card-domain'

import { buildReducer } from './reducer'
import { websocketURL } from '../config.json'
import { ServerConnection } from '../communication/serverConnection'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function communicationMiddleware(store) {
  const connection = new ServerConnection(websocketURL, store.dispatch.bind(store))
  return next => event => {
    if (event.hasOwnProperty('gameId') && !event.uiOnly) {
      connection.sendMessage(event)
    }
    next(event)
  }
}

export const store = createStore(buildReducer({ domain }), composeEnhancers(
  applyMiddleware(communicationMiddleware)
));
