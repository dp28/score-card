import {
  CONNECTED,
  connected,
  CONNECTING,
  connecting,
  DISCONNECTED,
  disconnected
} from './serverConnectionEvents'

describe('connected action creator', () => {
  it(`it should have the type ${CONNECTED}`, () => {
    expect(connected().type).toBe(CONNECTED)
  })

  it('it should have the uiOnly property set to true', () => {
    expect(connected().uiOnly).toBe(true)
  })
})

describe('connecting action creator', () => {
  it(`it should have the type ${CONNECTING}`, () => {
    expect(connecting().type).toBe(CONNECTING)
  })

  it('it should have the uiOnly property set to true', () => {
    expect(connecting().uiOnly).toBe(true)
  })
})

describe('disconnected action creator', () => {
  it(`it should have the type ${DISCONNECTED}`, () => {
    expect(disconnected().type).toBe(DISCONNECTED)
  })

  it('it should have the uiOnly property set to true', () => {
    expect(disconnected().uiOnly).toBe(true)
  })
})
