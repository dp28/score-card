import { buildStartedGameWithScore } from './gameSpecHelper.mjs'
import { addPlayerToGame, recordScore } from './gameEvents'
import { gameReducer } from './gameReducer'

import {
  selectTotals,
  selectTotalForPlayerName,
  selectGameName,
  selectPlayerNames
} from './gameSelectors'

const firstPlayerScore = 22
const secondPlayerScore = 43
const { game: onePlayerGame, player: firstPlayer } =
  buildStartedGameWithScore(firstPlayerScore)

const secondPlayerEvent = addPlayerToGame({
  gameId: onePlayerGame.id,
  playerName: 'Bob'
})
const secondPlayerScoreEvent = recordScore({
  gameId: onePlayerGame.id,
  playerId: secondPlayerEvent.playerId,
  score: secondPlayerScore
})

const game = [secondPlayerEvent, secondPlayerScoreEvent].reduce(gameReducer, onePlayerGame)

describe('selectTotals', () => {
  it('should return an array of objects with playerName and their total', () => {
    expect(selectTotals(game)).toEqual([
      { playerName: firstPlayer.name, total: firstPlayerScore },
      { playerName: secondPlayerEvent.playerName, total: secondPlayerScore },
    ])
  })
})

describe('selectGameName', () => {
  it('should return the name of the game', () => {
    expect(selectGameName({ name: 'test' })).toEqual('test')
  })
})

describe('selectPlayerNames', () => {
  it('should return a list of the names of all the players in the game', () => {
    expect(selectPlayerNames(game)).toEqual([
      firstPlayer.name,
      secondPlayerEvent.playerName
    ])
  })
})

describe('selectTotalForPlayerName', () => {
  it('should return the total for the player with that name', () => {
    expect(selectTotalForPlayerName(firstPlayer.name, game)).toEqual(firstPlayerScore)
  })

  describe('if there is no player with that name', () => {
    it('should return null', () => {
      expect(selectTotalForPlayerName('I cannot play', game)).toEqual(null)
    })
  })

  describe('if the passed in name is a different case from the stored name', () => {
    it('should return the total for the player with that name, case insensitive', () => {
      expect(selectTotalForPlayerName(firstPlayer.name.toUpperCase(), game)).toEqual(firstPlayerScore)
    })
  })
})
