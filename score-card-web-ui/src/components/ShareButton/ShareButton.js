import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { shareGame } from './ShareButtonActions'

export const ShareButton = ({ dispatchShare, classes }) => (
  <IconButton color="primary" onClick={dispatchShare}>
    <ShareIcon />
  </IconButton>
)

function mapDispatchToProps(dispatch, { gameId }) {
  return {
    dispatchShare: submitEvent => {
      submitEvent.preventDefault()
      dispatch(shareGame({ gameId }))
    }
  }
}

export const ConnectedShareButton = withRouter(
  connect(null, mapDispatchToProps)(ShareButton)
)
