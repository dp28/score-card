import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { recordScore } from 'score-card-domain'

import { selectGame } from '../../state/gameSelectors'

const styles = {
  player: {
    position: "relative",
  },
  title: {
    fontSize: 20,
  },
  total: {
    position: "absolute",
    right: 0,
    top: 0,
    fontSize: 20,
  },
  nextScore: {
    marginRight: 10,
    width: 100,
    marginTop: 0,
  }
};

export const Player = ({ player, total, gameId, updateScore, classes }) => {
  return (
    <Card>
      <CardContent>
        <div className={classes.player}>
          <Typography className={classes.title}>{player.name}</Typography>
          <Typography className={classes.total}>{total}</Typography>
        </div>
        <form onSubmit={updateScore}>
          <TextField
            id={`${player.id}_nextScore`}
            className={classes.nextScore}
            label="Next score"
            type="number"
            margin="normal"
          />
          <Button type="submit" variant="fab" mini>+</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function mapStateToProps(state, { player, gameId }) {
  return {
    total: selectGame(gameId, state).totals[player.id],
  }
}

function mapDispatchToProps(dispatch, { gameId, player }) {
  return {
    updateScore: event => {
      event.preventDefault();
      const scoreField = event.target[`${player.id}_nextScore`];
      const score = Number(scoreField.value);
      scoreField.value = ""
      dispatch(recordScore({ score, gameId, playerId: player.id }));
    }
  }
}

export const ConnectedPlayer = connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Player));
