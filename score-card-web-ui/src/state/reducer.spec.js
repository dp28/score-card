import { editingGameName, EDITING_GAME_NAME } from '../components/GameName/GameNameActions'
import { shareGame, SHARE_GAME } from '../components/ShareButton/ShareButtonActions'
import { buildReducer } from './reducer'

const INIT_EVENT = { type: 'INIT' }
const mockGameReducer = (game = { events: [] }, event) => ({
  ...game,
  events: [...game.events, event]
})

const reducer = buildReducer({ domain: { reducer: mockGameReducer } })

describe('reducer', () => {
  describe('calling without a state and an init event', () => {
    it('should return an object with a games property', () => {
      expect(reducer(undefined, INIT_EVENT)).toEqual({ games: {}, ui: { games: {} } })
    })
  })

  describe('calling with an event with a game id', () => {
    it('should return a games map from the id to the result of the game reducer', () => {
      const gameEvent = { gameId: 'bla' }
      const result = [INIT_EVENT, gameEvent].reduce(reducer, undefined)
      expect(result.games).toEqual({
        [gameEvent.gameId]: mockGameReducer(undefined, gameEvent)
      })
    })

    describe('if the event is uiOnly', () => {
      it('should not call the game reducer', () => {
        const uiAction = { gameId: 'bla', uiOnly: true }
        const spy = jest.fn()
        buildReducer({ domain: { reducer: spy } })(undefined, uiAction)
        expect(spy.mock.calls.length).toBe(0)
      })
    })
  })

  describe(`calling with a ${EDITING_GAME_NAME} action`, () => {
    it('should set the ui game name for the gameId to the gameName', () => {
      const action = editingGameName({ gameId: 'a', gameName: 'test' })
      const state = reducer(undefined, action)
      expect(state.ui.games.a.name).toEqual('test')
    })
  })

  describe(`calling with a domain CHANGE_NAME event`, () => {
    it('should set the ui game name for the gameId to null', () => {
      const editAction = editingGameName({ gameId: 'a', gameName: 'test' })
      const domainEvent = { type: 'DOMAIN_CHANGE_NAME', gameId: 'a', gameName: 'test' }
      const domain = { CHANGE_NAME: 'DOMAIN_CHANGE_NAME', reducer: x => x }
      const state = [editAction, domainEvent].reduce(buildReducer({ domain }), undefined)
      expect(state.ui.games.a.name).toEqual(null)
    })
  })

  describe(`calling with a ${SHARE_GAME} action`, () => {
    it('should set the ui game "sharing" property for the gameId to true', () => {
      const action = shareGame({ gameId: 'a' })
      const state = reducer(undefined, action)
      expect(state.ui.games.a.sharing).toBe(true)
    })
  })
})
