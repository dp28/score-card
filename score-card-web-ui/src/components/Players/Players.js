import React from 'react';
import { connect } from 'react-redux'

import { ConnectedPlayer } from '../Player/Player'
import { ConnectedNewPlayer } from '../NewPlayer/NewPlayer'

export const Players = ({ playerIds, }) => {
  return (
    <div className="Players">
      {
        playerIds.map(id => <ConnectedPlayer id={id} key={id}/>)
      }
      <ConnectedNewPlayer />
    </div>
  )
}

function mapStateToProps({ players }) {
  return { playerIds: Object.keys(players) }
}

export const ConnectedPlayers = connect(mapStateToProps)(Players);
