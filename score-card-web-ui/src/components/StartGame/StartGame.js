import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { startGame } from 'score-card-domain'

const styles = {
  textField: {
    marginRight: 10
  }
}

export const StartGame = ({ dispatchStartGame, classes }) => (
  <form onSubmit={dispatchStartGame}>
    <TextField
      className={classes.textField}
      id="gameName"
      label="Game name"
      margin="normal"
    />
    <Button type="submit" variant="contained" color="primary">
      Start game
    </Button>
  </form>
)

function mapDispatchToProps(dispatch, { history }) {
  return {
    dispatchStartGame: submitEvent => {
      submitEvent.preventDefault()
      const gameName = submitEvent.target.gameName.value
      submitEvent.target.value = ''
      const event = startGame({ gameName })
      dispatch(event)
      history.push(`/games/${event.gameId}`)
    }
  }
}

export const ConnectedStartGame = withRouter(
  connect(null, mapDispatchToProps)(withStyles(styles)(StartGame))
)
