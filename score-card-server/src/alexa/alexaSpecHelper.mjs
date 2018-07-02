export function buildAlexaMocks({ withSession = false } = {}) {
  const mocks = {
    gameManager: {
      getCurrentGameState: jest.fn(),
      getGameCount: jest.fn(),
      addGameEvent: jest.fn()
    },
    request: {
      slot: jest.fn(),
      say: jest.fn(),
      getSession: jest.fn()
    },
    response: {
      say: jest.fn(),
      shouldEndSession: jest.fn(),
      asText: () => mocks.response.say.mock.calls.map(args => args[0]).join(' ')
    }
  }
  if (withSession) {
    const session = {
      set: jest.fn(),
      get: jest.fn()
    }
    mocks.request.getSession.mockReturnValue(session)
    return { ...mocks, session }
  }

  return mocks
}

export function itShouldBehaveLikeASessionIntent({ buildIntent, buildDomain, whenThereIsAGame }) {
  let call
  let mocks
  let gameManager
  let request
  let response
  let session
  let domain

  beforeEach(() => {
    mocks = buildAlexaMocks({ withSession: true })
    gameManager = mocks.gameManager
    request = mocks.request
    response = mocks.response
    session = mocks.session
    domain = buildDomain()

    const intent = buildIntent({ gameManager, domain })
    call = () => intent.requestHandler(request, response)
  })

  it('should keep the session running', () => {
    call()
    expect(response.shouldEndSession.mock.calls).toEqual([[false]])
  })

  it('should get the gameId from the session', () => {
    call()
    expect(session.get.mock.calls).toEqual([['gameId']])
  })

  describe('when no id can found in the session', () => {
    beforeEach(() => {
      session.get.mockReturnValue(undefined)
    })

    it('should tell the user that they have not joined a game', () => {
      call()
      expect(response.asText()).toMatch(/join/i)
    })

    it('should not try and fetch a game', () => {
      call()
      expect(gameManager.getCurrentGameState.mock.calls.length).toBe(0)
    })
  })

  describe('when an id can be found in the session', () => {
    beforeEach(() => {
      session.get.mockReturnValue('fake-id')
    })

    it('should try and fetch a game using the id', () => {
      call()
      expect(gameManager.getCurrentGameState.mock.calls).toEqual([['fake-id']])
    })

    describe('when no game can be found', () => {
      it('should tell the user the game can no longer be found with that id', () => {
        call()
        expect(response.asText()).toMatch(/(found|find).+fake id/)
      })
    })

    describe('when the game can be found', () => {
      beforeEach(() => gameManager.getCurrentGameState.mockReturnValue({}))

      whenThereIsAGame({
        getDomain: () => domain,
        getMocks: () => mocks,
        callIntent: () => call()
      })
    })
  })
}
