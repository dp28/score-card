import React from 'react'
import { connect } from 'react-redux'

import { Players } from '../Players/Players'
import { ConnectedNewPlayer } from '../NewPlayer/NewPlayer'
import { ConnectedGameName } from '../GameName/GameName'
import { Loading } from '../Loading/Loading'
import { selectGame } from '../../state/gameSelectors'

export const Game = ({ game, loading }) => {
  if (loading) {
    return <Loading />
  }
  return (
    <div className="Game">
      <ConnectedGameName game={game} />
      <Players gameId={game.id} players={Object.values(game.players)} />
      <ConnectedNewPlayer gameId={game.id} />
    </div>
  )
}

function mapStateToProps(state, { match }) {
  const game = selectGame(match.params.gameId, state)
  return game ? { game } : { loading: true }
}

export const ConnectedGame = connect(mapStateToProps)(Game);
