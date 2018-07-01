import React from 'react'

import { ConnectedPlayer } from '../Player/Player'

export const Players = ({ players, gameId }) => (
  <div className="Players">
    {
      players.map(player => (
        <ConnectedPlayer key={player.id} player={player} gameId={gameId}/>
      ))
    }
  </div>
)
