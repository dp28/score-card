import React from 'react';
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { startGame } from 'score-card-domain'

export const StartGame = ({ dispatchStartGame }) => (
  <Button variant="contained" color="primary" onClick={dispatchStartGame}>
    Start game
  </Button>
)

function mapDispatchToProps(dispatch, { history }) {
  return {
    dispatchStartGame: () => {
      const event = startGame()
      dispatch(event)
      history.push(`/games/${event.gameId}`)
    }
  }
}

export const ConnectedStartGame = withRouter(
  connect(null, mapDispatchToProps)(StartGame)
)
