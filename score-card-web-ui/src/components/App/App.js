import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import { ConnectedStartGame } from '../StartGame/StartGame'
import { ConnectedPlayers } from '../Players/Players'

const appPadding = 10;

const styles = {
  app: {
    width: `calc(100% - ${appPadding * 2}px)`,
    height: `calc(100% - ${appPadding * 2}px)`,
    background: "#eeeeee",
    padding: appPadding,
  },
  title: {
    fontSize: 30,
    marginBottom: 20
  },
  content: {
    maxWidth: 400,
    padding: 10,
    margin: "auto",
  },
}

export const App = ({ hasStarted, classes }) => (
  <BrowserRouter>
    <div className={classes.app}>
      <Paper className={classes.content}>
        <Typography className={classes.title}>Score Card</Typography>

        <Route exact path="/" component={ConnectedStartGame}/>
        <Route path="/games/:gameId" component={ConnectedPlayers}/>
      </Paper>
    </div>
  </BrowserRouter>
)

function mapStateToProps({ id }) {
  return { hasStarted: Boolean(id) }
}

export const ConnectedApp = connect(mapStateToProps)(withStyles(styles)(App));
