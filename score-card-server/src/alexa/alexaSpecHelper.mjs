export function buildAlexaMocks({ withSession = false } = {}) {
  const mocks = {
    gameManager: {
      getCurrentGameState: jest.fn(() => Promise.resolve(null)),
      getGameCount: jest.fn(),
      addGameEvent: jest.fn(() => Promise.resolve({})),
      getMostRecentGameForClientId: jest.fn(() => Promise.resolve(null))
    },
    request: {
      slot: jest.fn(),
      getSession: jest.fn()
    },
    response: {
      say: jest.fn(),
      reprompt: jest.fn(),
      shouldEndSession: jest.fn(),
      asText: () => mocks.response.say.mock.calls.map(args => args[0]).join(' '),
      asRepromptText: () => mocks.response.reprompt.mock.calls.map(args => args[0]).join(' '),
      card: jest.fn()
    }
  }
  if (withSession) {
    const session = {
      set: jest.fn(),
      get: jest.fn(),
      user: {}
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

  it('should get the gameId from the session', async () => {
    await call()
    return expect(session.get.mock.calls).toEqual([['gameId']])
  })

  describe('when no id can found in the session', () => {
    beforeEach(() => {
      session.get.mockReturnValue(undefined)
    })

    it('should tell the user that they have not joined a game and ask for one', async () => {
      await call()
      return expect(response.asText()).toMatch(/haven't joined.*join/i)
    })

    it('should reprompt users to join a game', async () => {
      await call()
      return expect(response.asRepromptText()).toMatch(/game.*join/i)
    })

    it('should keep the session running', async () => {
      await call()
      return expect(response.shouldEndSession.mock.calls).toEqual([[false]])
    })

    it('should not try and fetch a game', async () => {
      await call()
      return expect(gameManager.getCurrentGameState.mock.calls.length).toBe(0)
    })

    describe('but can be found in the database', () => {
      beforeEach(() => {
        gameManager.getMostRecentGameForClientId.mockReturnValue(Promise.resolve({ id: 'id' }))
      })

      whenThereIsAGame({
        getDomain: () => domain,
        getMocks: () => mocks,
        callIntent: async () => await call()
      })
    })
  })

  describe('when an id can be found in the session', () => {
    beforeEach(() => {
      session.get.mockReturnValue('fake-id')
      gameManager.getCurrentGameState.mockReturnValue(Promise.resolve(null))
    })

    it('should try and fetch a game using the id', async () => {
      await call()
      return expect(gameManager.getCurrentGameState.mock.calls).toEqual([['fake-id']])
    })

    describe('when no game can be found', () => {
      beforeEach(() => gameManager.getCurrentGameState.mockReturnValue(Promise.resolve(null)))

      it('should tell the user the game can no longer be found with that id and ask for a new one', async () => {
        await call()
        return expect(response.asText()).toMatch(/(found|find).+fake id.*join/)
      })

      it('should keep the session running', async () => {
        await call()
        return expect(response.shouldEndSession.mock.calls).toEqual([[false]])
      })

      it('should reprompt users to join a game', async () => {
        await call()
        return expect(response.asRepromptText()).toMatch(/game.*join/i)
      })
    })

    describe('when the game can be found', () => {
      beforeEach(() => gameManager.getCurrentGameState.mockReturnValue(Promise.resolve({})))

      whenThereIsAGame({
        getDomain: () => domain,
        getMocks: () => mocks,
        callIntent: async () => await call()
      })
    })
  })
}
