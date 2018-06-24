import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { connect } from 'react-redux';

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
};

export const Player = ({ player, total, classes }) => {
  return (
    <Card>
      <CardContent><div className={classes.player}>
        <Typography className={classes.title}>{player.name}</Typography>
        <Typography className={classes.total}>{total}</Typography></div>
      </CardContent>
    </Card>
  )
}

function mapStateToProps({ players, totals }, { id }) {
  return {
    player: players[id],
    total: totals[id]
  }
}

export const ConnectedPlayer = connect(mapStateToProps)(withStyles(styles)(Player));
