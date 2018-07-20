import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import { ConnectedApp } from './components/App/App'
// import registerServiceWorker from './registerServiceWorker'
import { store } from './state/store'
import { dispatchEventsFromPathState } from './communication/urlEventSource'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)

// registerServiceWorker()

const dispatch = store.dispatch.bind(store)

dispatchEventsFromPathState(dispatch, window.location.pathname)
