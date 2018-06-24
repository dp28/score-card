import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { connect } from 'react-redux';

const styles = {
  title: {
    fontSize: 16,
  }
};

export const Player = ({ player, classes }) => {
  return (
    <Card>
      <CardContent>
        <Typography className={classes.title}>{player.name}</Typography>
      </CardContent>
    </Card>
  )
}

function mapStateToProps({ players }, { id }) {
  return { player: players[id] }
}

export const ConnectedPlayer = connect(mapStateToProps)(withStyles(styles)(Player));
