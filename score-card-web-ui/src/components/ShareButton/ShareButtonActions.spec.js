import { SHARE_GAME, shareGame } from './ShareButtonActions'

describe('shareGame action creator', () => {
  it(`it should have the type ${SHARE_GAME}`, () => {
    expect(shareGame({}).type).toBe(SHARE_GAME)
  })

  it('it should have the passed-in gameId', () => {
    expect(shareGame({ gameId: 'test' }).gameId).toEqual('test')
  })

  it('it should have the uiOnly property set to true', () => {
    expect(shareGame({}).uiOnly).toBe(true)
  })
})
