import { ConnectionManager } from './connectionManager.mjs';

function mockConnection(send) {
  return {
    send: send || (() => {}),
    on: () => {}
  };
}

let manager;

describe('ConnectionManager', () => {
  beforeEach(() => {
    manager = new ConnectionManager();
  });

  describe('#registerConnection', () => {
    it('should return a string id', () => {
      expect(typeof manager.registerConnection(mockConnection())).toBe('string')
    });

    it('should return a unique id', () => {
      expect(manager.registerConnection(mockConnection()))
        .not.toBe(manager.registerConnection(mockConnection()));
    });

    it('should increment the number of connections by one', () => {
      const numberOfConnections = manager.getConnectionCount();
      manager.registerConnection(mockConnection());
      expect(manager.getConnectionCount()).toBe(numberOfConnections + 1);
    });

    describe('if the connection is closed', () => {
      it('should be removed', () => {
        const connection = {
          on: (eventType, func) => { connection.handlers[eventType] = func },
          triggerEvent: eventType => { connection.handlers[eventType]() },
          handlers: {}
        };

        manager.registerConnection(connection);
        const numberOfConnections = manager.getConnectionCount();

        connection.triggerEvent('close');
        expect(manager.getConnectionCount()).toBe(numberOfConnections - 1);
      });
    });
  });

  describe('#sendToConnection', () => {
    describe('if no connection is registered with that id', () => {
      it('should return false', () => {
        expect(manager.sendToConnection('bla', {})).toBe(false);
      });
    });

    describe('if a connection is registered with that id', () => {
      let connection;
      let connectionId;

      beforeEach(() => {
        const connection = mockConnection();
        connectionId = manager.registerConnection(connection);
      });

      it('should return true', () => {
        expect(manager.sendToConnection(connectionId, {})).toBe(true);
      });

      it('should send a JSON stringified version of the message to the connection', () => {
        let sentMessage;
        const connection = mockConnection(message => sentMessage = message);
        connectionId = manager.registerConnection(connection);
        manager.sendToConnection(connectionId, { message: 'hi' });
        expect(sentMessage).toEqual('{"message":"hi"}');
      });
    });
  });
});
