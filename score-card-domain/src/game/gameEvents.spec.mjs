import {
  startGame,
  START_GAME,
  addPlayerToGame,
  ADD_PLAYER,
  recordScore,
  RECORD_SCORE,
  removePlayer,
  REMOVE_PLAYER,
  joinGame,
  JOIN_GAME,
  changeName,
  CHANGE_NAME
} from './gameEvents'

function itShouldBehaveLikeAGameEvent({ eventCreator, type, data }) {
  const clientId = 'device-1'
  const event = eventCreator(Object.assign({}, data, { clientId }))

  it(`should return an event with the type "${type}"`, () => {
    expect(event.type).toBe(type)
  })

  it('should have its own id', () => {
    expect(event.hasOwnProperty('id')).toBe(true)
  })

  it('should have the passed in clientId', () => {
    expect(event.clientId).toBe(clientId)
  })

  it('should have an accurate timestamp as its createdAt', () => {
    expect(isWithinOneSecondOfNow(eventCreator(data).createdAt)).toBe(true)
  })

  it('should have a gameId', () => {
    expect(eventCreator(data).hasOwnProperty('gameId')).toBe(true)
  })
}

const SecondInMilliseconds = 1000

function isWithinOneSecondOfNow(date) {
  const dateInMilliseconds = Number(date)
  const nowInMilliseconds = Number(new Date())
  return nowInMilliseconds >= dateInMilliseconds - SecondInMilliseconds &&
    nowInMilliseconds <= dateInMilliseconds + SecondInMilliseconds
}

describe('startGame', () => {
  itShouldBehaveLikeAGameEvent({
    eventCreator: startGame,
    type: START_GAME
  })

  it('should generate the id of the game', () => {
    expect(startGame().hasOwnProperty('gameId')).toBe(true)
  })

  it('should include the a null name for the game if one was not given', () => {
    expect(startGame().gameName).toBeNull()
  })

  it('should include the name of the game if one was given', () => {
    expect(startGame({ gameName: 'My game'}).gameName).toEqual('My game')
  })
})

describe('addPlayerToGame', () => {
  const gameId = 'game-id'
  const playerName = 'player-1'

  const event = addPlayerToGame({ playerName, gameId })

  itShouldBehaveLikeAGameEvent({
    eventCreator: addPlayerToGame,
    type: ADD_PLAYER,
    data: { playerName, gameId }
  })

  it('should generate the id of the player', () => {
    expect(event.hasOwnProperty('playerId')).toBe(true)
  })

  it('should include the name of the player', () => {
    expect(event.playerName).toBe(playerName)
  })

  it('should include the id of the game', () => {
    expect(event.gameId).toBe(gameId)
  })
})

describe('recordScore', () => {
  const gameId = 'game-id'
  const playerId = 'player-id'
  const score = 12

  const event = recordScore({ score, playerId, gameId })

  itShouldBehaveLikeAGameEvent({
    eventCreator: recordScore,
    type: RECORD_SCORE,
    data: { score, playerId, gameId }
  })

  it('should include the id of the player', () => {
    expect(event.playerId).toBe(playerId)
  })

  it('should include the score', () => {
    expect(event.score).toBe(score)
  })

  it('should include the id of the game', () => {
    expect(event.gameId).toBe(gameId)
  })
})

describe('removePlayer', () => {
  const gameId = 'game-id'
  const playerId = 'player-id'

  const event = removePlayer({ playerId, gameId })

  itShouldBehaveLikeAGameEvent({
    eventCreator: removePlayer,
    type: REMOVE_PLAYER,
    data: { playerId, gameId }
  })

  it('should include the id of the player', () => {
    expect(event.playerId).toBe(playerId)
  })

  it('should include the id of the game', () => {
    expect(event.gameId).toBe(gameId)
  })
})

describe('joinGame', () => {
  const gameId = 'game-id'
  const playerId = 'player-id'

  const event = joinGame({ gameId })

  itShouldBehaveLikeAGameEvent({
    eventCreator: joinGame,
    type: JOIN_GAME,
    data: { gameId }
  })
})

describe('changeName', () => {
  const gameId = 'game-id'

  itShouldBehaveLikeAGameEvent({
    eventCreator: changeName,
    type: CHANGE_NAME,
    data: { gameName: 'fake', gameId }
  })

  it('should include the id of the game', () => {
    expect(changeName({ gameName: 'bla', gameId }).gameId).toBe(gameId)
  })

  it('should include the name of the game if one was given', () => {
    expect(changeName({ gameName: 'My game'}).gameName).toEqual('My game')
  })
})
