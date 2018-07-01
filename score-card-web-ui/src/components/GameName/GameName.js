import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import { connect } from 'react-redux'
import { changeName } from 'score-card-domain'

import { editingGameName } from './GameNameActions'

const styles = {
  titleInput: {
    marginRight: 10,
    marginBottom: 10,
    fontSize: '1.5em'
  }
}

export const GameName = ({ changeGameName, saveNewGameName, gameName, classes }) => {
  return (
    <form onSubmit={saveNewGameName}>
      <Input
        className={classes.titleInput}
        id="gameNameField"
        label="Game name"
        placeholder="Game name"
        value={gameName || ''}
        onChange={changeGameName}
      />
    </form>
  )
}

function mapStateToProps({ ui }, props) {
  const game = props.game || {}
  const { name: newName } = ui.games[game.id] || {}
  const gameName = newName || newName === '' ? newName : game.name
  return { gameName }
}

function mapDispatchToProps(dispatch, { game }) {
  return {
    changeGameName: event => {
      event.preventDefault()
      const gameName = event.target.value
      dispatch(editingGameName({ gameName, gameId: game.id }))
    },
    saveNewGameName: event => {
      event.preventDefault()
      const gameNameField = event.target.gameNameField
      const gameName = gameNameField.value
      dispatch(changeName({ gameName, gameId: game.id }))
      gameNameField.blur()
    }
  }
}

export const ConnectedGameName = connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(GameName))
