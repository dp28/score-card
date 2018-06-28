import { createStore, applyMiddleware, compose } from 'redux'
import { reducer } from 'score-card-domain'

import { broadcastEventsMiddleware, setupBroadcastsAsInput } from '../websockets'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(
  applyMiddleware(broadcastEventsMiddleware)
));

setupBroadcastsAsInput(store)
