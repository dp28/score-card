import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { joinGame } from 'score-card-domain'

const styles = {
  textField: {
    marginRight: 10
  }
}

export const JoinGame = ({ dispatchJoinGame, classes }) => (
  <form onSubmit={dispatchJoinGame}>
    <TextField
      className={classes.textField}
      id="gameId"
      label="Game id"
      margin="normal"
    />
    <Button type="submit" variant="contained" color="primary">
      Join game
    </Button>
  </form>
)

function mapDispatchToProps(dispatch, { history }) {
  return {
    dispatchJoinGame: submitEvent => {
      submitEvent.preventDefault()
      const gameId = submitEvent.target.gameId.value
      submitEvent.target.value = ''
      const joinEvent = joinGame({ gameId })
      dispatch(joinEvent)
      history.push(`/games/${joinEvent.gameId}`)
    }
  }
}

export const ConnectedJoinGame = withRouter(
  connect(null, mapDispatchToProps)(withStyles(styles)(JoinGame))
)
