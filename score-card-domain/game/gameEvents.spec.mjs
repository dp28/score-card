import {
  startGame,
  START_GAME,
  addPlayerToGame,
  ADD_PLAYER,
  recordScore,
  RECORD_SCORE,
  removePlayer,
  REMOVE_PLAYER
} from './gameEvents.mjs'

function itShouldBehaveLikeADomainEvent({ eventCreator, type, data }) {
  const event = eventCreator(data)

  it(`should return an event with the type "${type}"`, () => {
    expect(event.type).toBe(type)
  })

  it('should have its own id', () => {
    expect(event.hasOwnProperty('id')).toBe(true)
  })

  it('should have an accurate timestamp as its createdAt', () => {
    expect(isWithinOneSecondOfNow(eventCreator(data).createdAt)).toBe(true)
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
  itShouldBehaveLikeADomainEvent({
    eventCreator: startGame,
    type: START_GAME
  })

  it('should generate the id of the game', () => {
    expect(startGame().hasOwnProperty('gameId')).toBe(true)
  })
})

describe('addPlayerToGame', () => {
  const gameId = 'game-id'
  const playerName = 'player-1'

  const event = addPlayerToGame({ playerName, gameId })

  itShouldBehaveLikeADomainEvent({
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

  itShouldBehaveLikeADomainEvent({
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

  itShouldBehaveLikeADomainEvent({
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
