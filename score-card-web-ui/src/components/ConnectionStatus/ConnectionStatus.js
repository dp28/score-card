import React from 'react'
import CloudDoneIcon from '@material-ui/icons/CloudDone'
import CloudQueueIcon from '@material-ui/icons/CloudQueue'
import CloudOffIcon from '@material-ui/icons/CloudOff'
import { connect } from 'react-redux'

import {
  CONNECTED_STATUS,
  CONNECTING_STATUS,
  DISCONNECTED_STATUS
} from '../../communication/connectionReducer'

export const ConnectionStatus = ({ connectionStatus }) => {
  return {
    [CONNECTED_STATUS]: <CloudDoneIcon />,
    [CONNECTING_STATUS]: <CloudQueueIcon />,
    [DISCONNECTED_STATUS]: <CloudOffIcon />
  }[connectionStatus]
}

function mapStateToProps({ ui }) {
  return {
    connectionStatus: ui.connection.status
  }
}

export const ConnectedConnectionStatus = connect(mapStateToProps)(ConnectionStatus)
