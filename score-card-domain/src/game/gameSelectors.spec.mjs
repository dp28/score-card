import { buildStartedGameWithScore } from './gameSpecHelper.mjs'
import { addPlayerToGame, recordScore } from './gameEvents'
import { gameReducer } from './gameReducer'

import {
  selectTotals,
  selectTotalForPlayerName,
  selectGameName,
  selectPlayerNames,
  selectPlayerTotal,
  selectPlayerByName
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

describe('selectPlayerTotal', () => {
  it('should return the total for the playerId', () => {
    expect(selectPlayerTotal(firstPlayer.id, game)).toEqual(firstPlayerScore)
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
      expect(selectTotalForPlayerName('I cannot play', game)).toBeNull()
    })
  })

  describe('if the passed in name is a different case from the stored name', () => {
    it('should return the total for the player with that name, case insensitive', () => {
      expect(selectTotalForPlayerName(firstPlayer.name.toUpperCase(), game)).toEqual(firstPlayerScore)
    })
  })
})

describe('selectPlayerByName', () => {
  it('should return the total for the player with that name', () => {
    expect(selectPlayerByName(firstPlayer.name, game)).toEqual(firstPlayer)
  })

  describe('if the passed in name is a different case from the stored name', () => {
    it('should return the total for the player with that name, case insensitive', () => {
      expect(selectPlayerByName(firstPlayer.name.toUpperCase(), game)).toEqual(firstPlayer)
    })
  })

  describe('if there is no player with that name', () => {
    function withPlayers(...playerNames) {
      return {
        players: playerNames.reduce((players, name, i) => {
          const id = name + i
          players[id] = { id, name }
          return players
        }, {})
      }
    }

    it('should find players with a single character difference in spelling', () => {
      const game = withPlayers('Daniel', 'John', 'Alex', 'Mike')
      expect(selectPlayerByName('Alec', game).name).toEqual('Alex')
    })

    it('should find players with fairly similar names', () => {
      const game = withPlayers('Daniel', 'John', 'Alex', 'Mike')
      expect(selectPlayerByName('Danyal', game).name).toEqual('Daniel')
      expect(selectPlayerByName('Jon', game).name).toEqual('John')
    })

    it('should not return a player if the differences in spelling are large', () => {
      const game = withPlayers('Daniel', 'John', 'Alex', 'Mike')
      expect(selectPlayerByName('Jamie', game)).toBeNull()
    })
  })
})
