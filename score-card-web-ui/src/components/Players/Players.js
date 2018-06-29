import React from 'react';
import { connect } from 'react-redux'

import { ConnectedPlayer } from '../Player/Player'
import { ConnectedNewPlayer } from '../NewPlayer/NewPlayer'
import { selectGame } from '../../state/gameSelectors'

export const Players = ({ players, gameId, loading }) => {
  if (loading) {
    return <div className="loading" />
  }
  return (
    <div className="Players">
      {
        players.map(player => (
          <ConnectedPlayer key={player.id} player={player} gameId={gameId}/>
        ))
      }
      <ConnectedNewPlayer gameId={gameId} />
    </div>
  )
}

function mapStateToProps(state, { match }) {
  const game = selectGame(match.params.gameId, state)
  if (game) {
    return {
      gameId: game.id,
      players: Object.values(game.players)
    }
  }
  else {
    return { loading: true }
  }
}

export const ConnectedPlayers = connect(mapStateToProps)(Players);
