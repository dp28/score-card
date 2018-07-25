import React from 'react'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import cyan from '@material-ui/core/colors/cyan'
import indigo from '@material-ui/core/colors/indigo'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'

import { Home } from '../Home/Home'
import { ConnectedGame } from '../Game/Game'
import { ConnectedConnectionStatus } from '../ConnectionStatus/ConnectionStatus'

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: cyan
  },
})

const appPadding = 10

const styles = {
  app: {
    width: `calc(100% - ${appPadding * 2}px)`,
    height: `calc(100% - ${appPadding * 2}px)`,
    background: "#eeeeee",
    margin: 'auto'
  },
  title: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  spacer: {
    flexGrow: 1
  },
  logo: {
    display: 'inline-block',
    width: 'auto',
    height: 64,
    verticalAlign: 'middle'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    paddingRight: 10,
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none'
    },
    '&:hover': {
      background: indigo[800]
    }
  },
  content: {
    position: 'relative',
    maxWidth: 400,
    padding: 10,
    margin: "auto",
    marginTop: 80
  },
}

export const App = ({ hasStarted, classes }) => (
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <div className={classes.app}>
        <AppBar>
          <Toolbar>
            <Link to="/" className={classes.link}>
              <img src="/icon.svg" className={classes.logo} alt=""/>
              <Typography variant="title" color="inherit" className={classes.title}>
                Score Card
              </Typography>
            </Link>
            <div className={classes.spacer} />
            <ConnectedConnectionStatus />
          </Toolbar>
        </AppBar>
        <Paper className={classes.content}>
          <Route exact path="/" component={Home}/>
          <Route path="/games/:gameId" component={ConnectedGame}/>
        </Paper>
      </div>
    </BrowserRouter>
  </MuiThemeProvider>
)

function mapStateToProps({ id }) {
  return { hasStarted: Boolean(id) }
}

export const ConnectedApp = connect(mapStateToProps)(withStyles(styles)(App));
