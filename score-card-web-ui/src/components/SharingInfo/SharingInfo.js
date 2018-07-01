import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import { hideSharing } from './SharingInfoActions'

const styles = {
  link: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    display: 'block'
  },
  code: {
    fontFamily: 'monospace',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: '1.2em'
  },
  instructions: {
    fontSize: '0.9em'
  },
  speech: {
    fontStyle: 'italic'
  }
}

export const SharingInfo = ({ shouldShow, readableGameId, classes, gameId, hide }) => {
  if (!shouldShow) {
    return null
  }
  const link = window.location.href
  return (
    <Card>
      <CardContent>
        <Typography>
          Here's the link to this game:
          <a className={classes.link} href={link}>{link}</a>
        </Typography>
        <Typography>
          or just enter this id on the home page:
        </Typography>
        <Typography className={classes.code}>{gameId}</Typography>
        <Typography>
          or join this game through Amazon Alexa
        </Typography>
        <ol className={classes.instructions}>
          <li>
            <Typography>
              Install the Score Card skill
            </Typography>
          </li>
          <li>
            <Typography className={classes.speech}>
              "Open score card"
            </Typography>
          </li>
          <li>
            <Typography className={classes.speech}>
              "Join {readableGameId}"
            </Typography>
          </li>
        </ol>
        <CardActions>
          <Button variant="outlined" onClick={hide}>
            Hide
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

function mapStateToProps({ ui }, { gameId }) {
  return {
    shouldShow: (ui.games[gameId] || {}).sharing,
    readableGameId: gameId.replace(/-/g, ' ')
  }
}

function mapDispatchToProps(dispatch, { gameId }) {
  return {
    hide: event => {
      event.preventDefault()
      dispatch(hideSharing({ gameId }))
    }
  }
}

export const ConnectedSharingInfo = connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(SharingInfo))
