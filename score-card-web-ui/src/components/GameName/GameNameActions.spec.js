import { EDITING_GAME_NAME, editingGameName } from './GameNameActions'

describe('editingGameName action creator', () => {
  it(`it should have the type ${EDITING_GAME_NAME}`, () => {
    expect(editingGameName({}).type).toBe(EDITING_GAME_NAME)
  })

  it('it should have the passed-in gameId', () => {
    expect(editingGameName({ gameId: 'test' }).gameId).toEqual('test')
  })

  it('it should have the passed-in gameName', () => {
    expect(editingGameName({ gameName: 'test' }).gameName).toEqual('test')
  })

  it('it should have the uiOnly property set to true', () => {
    expect(editingGameName({}).uiOnly).toBe(true)
  })
})
