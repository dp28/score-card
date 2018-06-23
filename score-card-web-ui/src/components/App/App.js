import React from 'react';
import { connect } from 'react-redux'

import { ConnectedStartGame } from '../StartGame/StartGame'
import { ConnectedNewPlayer } from '../NewPlayer/NewPlayer'

export const App = ({ hasStarted }) => (
  hasStarted ? <ConnectedNewPlayer /> : <ConnectedStartGame />
)

function mapStateToProps({ id }) {
  return { hasStarted: Boolean(id) }
}

export const ConnectedApp = connect(mapStateToProps)(App)
