import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { Players } from '../Players/Players'
import { ConnectedNewPlayer } from '../NewPlayer/NewPlayer'
import { ConnectedGameName } from '../GameName/GameName'
import { ConnectedShareButton } from '../ShareButton/ShareButton'
import { Loading } from '../Loading/Loading'
import { selectGame } from '../../state/gameSelectors'
import { ConnectedSharingInfo } from '../SharingInfo/SharingInfo'

const styles = {
  share: {
    position: 'absolute',
    top: 5,
    right: 10
  },
}

export const Game = ({ game, loading, classes }) => {
  if (loading) {
    return <Loading />
  }
  return (
    <div className="Game">
      <span className={classes.share}>
        <ConnectedShareButton gameId={game.id} />
      </span>

      <ConnectedGameName game={game} />

      <ConnectedSharingInfo gameId={game.id} />
      <Players gameId={game.id} players={Object.values(game.players)} />
      <ConnectedNewPlayer gameId={game.id} />
    </div>
  )
}

function mapStateToProps(state, { match }) {
  const game = selectGame(match.params.gameId, state)
  return game ? { game } : { loading: true }
}

export const ConnectedGame = connect(mapStateToProps)(withStyles(styles)(Game))
