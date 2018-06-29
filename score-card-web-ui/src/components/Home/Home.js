import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { ConnectedStartGame } from '../StartGame/StartGame'
import { ConnectedJoinGame } from '../JoinGame/JoinGame'

const styles = {
  separatorText: {
    fontSize: 20,
    marginTop: 10
  }
}

export const UnstyledHome = ({ classes }) => (
  <div className="Home">
    <ConnectedStartGame />
    <Typography className={classes.separatorText}>or</Typography>
    <ConnectedJoinGame />
  </div>
)

export const Home = withStyles(styles)(UnstyledHome)
