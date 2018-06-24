import React from 'react';
import { connect } from 'react-redux'

import { ConnectedStartGame } from '../StartGame/StartGame'
import { ConnectedPlayers } from '../Players/Players'

export const App = ({ hasStarted }) => (
  hasStarted ? <ConnectedPlayers /> : <ConnectedStartGame />
)

function mapStateToProps({ id }) {
  return { hasStarted: Boolean(id) }
}

export const ConnectedApp = connect(mapStateToProps)(App)
