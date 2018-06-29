import { createStore, applyMiddleware, compose } from 'redux'
import { reducer } from 'score-card-domain'

import { websocketURL } from '../config.json'
import { ServerConnection } from '../communication/serverConnection'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function communicationMiddleware(store) {
  const connection = new ServerConnection(websocketURL, store.dispatch.bind(store))
  return next => event => {
    connection.sendMessage(event)
    next(event)
  }
}

export const store = createStore(reducer, composeEnhancers(
  applyMiddleware(communicationMiddleware)
));
