import { buildReducer } from './reducer'

const INIT_EVENT = { type: 'INIT' }
const mockGameReducer = (game = { events: [] }, event) => ({
  ...game,
  events: [...game.events, event]
})

const reducer = buildReducer(mockGameReducer)

describe('reducer', () => {
  describe('calling without a state and an init event', () => {
    it('should return an object with a games property', () => {
      expect(reducer(undefined, INIT_EVENT)).toEqual({ games: {} })
    })
  })

  describe('calling with an event with a game id', () => {
    it('should return a games map from the id to the result of the game reducer', () => {
      const gameEvent = { gameId: 'bla' }
      const result = [INIT_EVENT, gameEvent].reduce(reducer, undefined)
      expect(result).toEqual({
        games: { [gameEvent.gameId]: mockGameReducer(undefined, gameEvent) }
      })
    })
  })
})
