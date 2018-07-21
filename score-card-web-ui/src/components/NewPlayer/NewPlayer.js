import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import { addPlayerToGame } from '../../domainEvents'

const styles = {
  textField: {
    marginRight: 10
  }
}

export const NewPlayer = ({ addPlayer, gameId, classes }) => {
  return (
      <Card>
        <CardContent>
          <form onSubmit={addPlayer}>
            <TextField
              className={classes.textField}
              id="playerNameField"
              label="Add player"
              margin="normal"
            />
            <Button type="submit" variant="fab" mini>+</Button>
          </form>
        </CardContent>
      </Card>
  )
}

function mapDispatchToProps(dispatch, { gameId }) {
  return {
    addPlayer: event => {
      event.preventDefault()
      const playerNameField = event.target.playerNameField
      const playerName = playerNameField.value
      playerNameField.value = ""
      dispatch(addPlayerToGame({ playerName, gameId  }))
    }
  }
}

export const ConnectedNewPlayer = connect(
  null, mapDispatchToProps
)(withStyles(styles)(NewPlayer))
