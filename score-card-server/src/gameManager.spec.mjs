import { GameManager } from './gameManager.mjs';

let manager;
let sendToConnection;

function findMessagesSentTo(connectionId) {
  return sendToConnection
    .mock
    .calls
    .filter(args => args[0] == connectionId)
    .map(args => args[1]);
}

describe('GameManager', () => {
  beforeEach(() => {
    sendToConnection = jest.fn()
    manager = new GameManager(sendToConnection);
  });

  describe('#addGameEvent', () => {
    describe('if no games exist', () => {
      it('adds a new game', () => {
        const originalGameCount = manager.getGameCount()
        manager.addGameEvent({ gameId: 'a' }, 'b');
        expect(manager.getGameCount() - originalGameCount).toBe(1);
      });
    });

    it('does not send the event to the connection that sent the event', () => {
      const senderId = 'b';
      manager.addGameEvent({ gameId: 'a' }, senderId);
      expect(sendToConnection.mock.calls.length).toBe(0);
    });

    describe('if a game exists', () => {
      const gameId = 'a';
      const senderId = 'fake';
      const firstEvent = { gameId };

      beforeEach(() => {
        manager.addGameEvent(firstEvent, senderId);
      });

      describe('and another event is added by the same connection for the same game', () => {
        it('does not add a new game', () => {
          const originalGameCount = manager.getGameCount();
          manager.addGameEvent({ gameId, data: 2 }, senderId);
          expect(manager.getGameCount() - originalGameCount).toBe(0);
        });

        it('does not send any messages to the connection', () => {
          manager.addGameEvent({ gameId, data: 2 }, senderId);
          expect(findMessagesSentTo(senderId).length).toBe(0);
        });
      });

      describe('and another connection sends an event to the game', () => {
        const otherSenderId = 'b';
        const secondEvent = { gameId , data: 1 };

        beforeEach(() => manager.addGameEvent(secondEvent, otherSenderId));

        it('sends the event to earlier connections that have sent events for the game', () => {
          const firstConnectionMessages = findMessagesSentTo(senderId);
          expect(firstConnectionMessages.length).toBe(1);
          expect(firstConnectionMessages[0]).toBe(secondEvent);
        });

        it('sends the earlier events to the new connection', () => {
          const secondConnectionMessages = findMessagesSentTo(otherSenderId);
          expect(secondConnectionMessages.length).toBe(1);
          expect(secondConnectionMessages[0]).toBe(firstEvent);
        });
      });

      describe('and another event is added for a different game', () => {
        it('adds a new game', () => {
          const originalGameCount = manager.getGameCount();
          manager.addGameEvent({ gameId: 'another' }, 'b');
          expect(manager.getGameCount() - originalGameCount).toBe(1);
        });
      });
    });
  });
});