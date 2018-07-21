import { reducer, joinGame, addPlayerToGame } from './score-card-domain.mjs'

import { GameManager } from './gameManager.mjs'

let manager
let sendToConnection
let repository

function findMessagesSentTo(connectionId) {
  return sendToConnection
    .mock
    .calls
    .filter(args => args[0] == connectionId)
    .map(args => args[1])
}

describe('GameManager', () => {
  beforeEach(() => {
    sendToConnection = jest.fn()
    repository = {
      store: jest.fn(() => Promise.resolve({})),
      findByGameId: jest.fn(() => Promise.resolve([]))
    }
    manager = new GameManager(sendToConnection, repository)
  })

  describe('#addGameEvent', () => {
    describe('if no games exist', () => {
      it('adds a new game', async () => {
        const originalGameCount = manager.getGameCount()
        await manager.addGameEvent({ gameId: 'a' }, 'b')
        return expect(manager.getGameCount() - originalGameCount).toBe(1)
      })
    })

    it('does not send the event to the connection that sent the event', async () => {
      const senderId = 'b'
      await manager.addGameEvent({ gameId: 'a' }, senderId)
      return expect(sendToConnection.mock.calls.length).toBe(0)
    })

    it('stores the event in the repository', async () => {
      await manager.addGameEvent({ gameId: 'a' }, 'bla')
      return expect(repository.store.mock.calls).toEqual([[{ gameId: 'a' }]])
    })

    it('reads the current events for the game from the repository', async () => {
      await manager.addGameEvent({ gameId: 'a' }, 'bla')
      return expect(repository.findByGameId.mock.calls).toEqual([['a']])
    })

    describe('if a game exists', () => {
      const gameId = 'a'
      const senderId = 'fake'
      const firstEvent = { gameId }

      beforeEach(async () => {
        await manager.addGameEvent(firstEvent, senderId)
        repository.findByGameId.mockReturnValue([firstEvent])
      })

      describe('and another event is added by the same connection for the same game', () => {
        it('does not add a new game', async () => {
          const originalGameCount = manager.getGameCount()
          await manager.addGameEvent({ gameId, data: 2 }, senderId)
          return expect(manager.getGameCount() - originalGameCount).toBe(0)
        })

        it('does not send any messages to the connection', async () => {
          await manager.addGameEvent({ gameId, data: 2 }, senderId)
          return expect(findMessagesSentTo(senderId).length).toBe(0)
        })
      })

      describe('and another connection sends an event to the game', () => {
        const otherSenderId = 'b'
        const secondEvent = { gameId , data: 1 }

        beforeEach(async () => await manager.addGameEvent(secondEvent, otherSenderId))

        it('sends the event to earlier connections that have sent events for the game', async () => {
          const firstConnectionMessages = findMessagesSentTo(senderId)
          expect(firstConnectionMessages.length).toBe(1)
          return expect(firstConnectionMessages[0]).toBe(secondEvent)
        })

        it('sends the earlier events to the new connection', async () => {
          const secondConnectionMessages = findMessagesSentTo(otherSenderId)
          expect(secondConnectionMessages.length).toBe(1)
          return expect(secondConnectionMessages[0]).toBe(firstEvent)
        })
      })

      describe('and another event is added for a different game', () => {
        it('adds a new game', async () => {
          const originalGameCount = manager.getGameCount()
          await manager.addGameEvent({ gameId: 'another' }, 'b')
          return expect(manager.getGameCount() - originalGameCount).toBe(1)
        })
      })

      describe('if an event is added without a conection id', () => {
        describe('and another event is added by a connection', () => {
          it('should not try and send the event to the undefined connectionId', async () => {
            const gameId = 'b'
            await manager.addGameEvent({ gameId })
            await manager.addGameEvent({ gameId }, 'connectionSenderId')
            return expect(findMessagesSentTo(undefined).length).toBe(0)
          })
        })
      })
    })
  })

  describe('#getCurrentGameState', () => {
    describe('when no events have been added for that game id', () => {
      it('should return null', async () => {
        return expect(await manager.getCurrentGameState('bla')).toBe(null)
      })
    })

    describe('when events for that game id are returned from the repository', () => {
      it('should return the result of reducing all of those events', async () => {
        const events = [
          joinGame({ gameId: 'a' }),
          addPlayerToGame({ gameId: 'a', playerName: 'Joe' })
        ]
        repository.findByGameId = () => Promise.resolve(events)
        const expected = events.reduce(reducer, undefined)
        return expect(await manager.getCurrentGameState('a')).toEqual(expected)
      })
    })
  })
})
