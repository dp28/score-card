import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

import { addPlayerToGame } from 'score-card-domain'

const styles = {
  textField: {
    width: "100%"
  }
}

export const NewPlayer = ({ addPlayer, gameId, classes }) => {
  const addPlayerToCurrentGame = addPlayer(gameId)
  return (
    <form onSubmit={addPlayerToCurrentGame}>
      <Card>
        <CardContent>
          <TextField
            className={classes.textField}
            id="playerNameField"
            label="Add player"
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button type="submit">Add</Button>
        </CardActions>
      </Card>
    </form>
  )
}

function mapStateToProps({ id }) {
  return { gameId: id }
}

function mapDispatchToProps(dispatch) {
  return {
    addPlayer: gameId => event => {
      event.preventDefault();
      const playerNameField = event.target.playerNameField;
      const playerName = playerNameField.value;
      playerNameField.value = ""
      dispatch(addPlayerToGame({ playerName, gameId  }));
    }
  }
}

export const ConnectedNewPlayer = connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(NewPlayer));
