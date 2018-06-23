import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

import { startGame } from 'score-card-domain'

export const StartGame = ({ dispatchStartGame }) => (
  <Button variant="contained" color="primary" onClick={dispatchStartGame}>
    Start game
  </Button>
)

function mapDispatchToProps(dispatch) {
  return {
    dispatchStartGame: () => dispatch(startGame())
  }
}

export const ConnectedStartGame = connect(null, mapDispatchToProps)(StartGame)
