import { websocketURL } from "./config.json"

const WebSocket = window.WebSocket || window.MozWebSocket;

const Connection = new WebSocket(websocketURL);

Connection.onerror = console.log

export const broadcastEventsMiddleware = store => next => event => {
  if (event.hasOwnProperty("gameId")) {
    Connection.send(JSON.stringify(event))
  }
  next(event)
}

export function setupBroadcastsAsInput(store) {
  Connection.onmessage = message => {
    try {
      const jsonEvent = JSON.parse(message.data);
      store.dispatch(jsonEvent)
    } catch (e) {
      console.log("This isn't valid JSON: ", message.data);
      return;
    }
  };
}
