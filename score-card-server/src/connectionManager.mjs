import { generateId } from './score-card-domain.mjs'

export class ConnectionManager {

  constructor() {
    this.connectionMap = new Map();
  }

  registerConnection(connection) {
    const id = generateId();
    this.connectionMap.set(id, connection);
    connection.on('close', () => this.connectionMap.delete(id));
    return id;
  }

  getConnectionCount() {
    return this.connectionMap.size;
  }

  sendToConnection(connectionId, message) {
    if (this.connectionMap.has(connectionId)) {
      const connection = this.connectionMap.get(connectionId);
      connection.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

}
