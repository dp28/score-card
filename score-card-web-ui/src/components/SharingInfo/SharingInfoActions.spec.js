import { HIDE_SHARING, hideSharing } from './SharingInfoActions'

describe('hideSharing action creator', () => {
  it(`it should have the type ${HIDE_SHARING}`, () => {
    expect(hideSharing({}).type).toBe(HIDE_SHARING)
  })

  it('it should have the passed-in gameId', () => {
    expect(hideSharing({ gameId: 'test' }).gameId).toEqual('test')
  })

  it('it should have the uiOnly property set to true', () => {
    expect(hideSharing({}).uiOnly).toBe(true)
  })
})
