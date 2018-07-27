import { CONNECTED } from '../communication/serverConnectionEvents'

const EVENTS_KEY = 'EVENTS'

function isDomainEvent(event) {
  return event.hasOwnProperty('gameId') && !event.uiOnly
}

export const persistStateMiddleware = dependencies => store => {
  const persistedEvents = new PersistedEvents(dependencies)
  persistedEvents.waitUntilLoaded.then(() => {
    dispatchAllEvents(store, persistedEvents.toArray())
  })

  return next => event => {
    if (event.type === CONNECTED) {
      const events = persistedEvents.toArray()
      runAsync(() => dispatchAllEvents(store, events))
    }
    persistedEvents.persist(event)
    next(event)
  }
}

function dispatchAllEvents(store, events) {
  events.forEach(event => { store.dispatch(event) })
}

function runAsync(fn) {
  Promise.resolve().then(fn)
}

class PersistedEvents {

  constructor({ storage, domain }) {
    this._storage = storage
    this._events = []
    this._event_ids = new Set([])
    this._isEqualJoinGameEvent = domain.isEqualJoinGameEvent
    this.waitUntilLoaded = this._load()
  }

  toArray() {
    return this._events
  }

  async persist(event) {
    await this.waitUntilLoaded
    if (this._shouldPersist(event)) {
      this._addEvent(event)
      return await this._storage.setItem(EVENTS_KEY, this._events)
    }
  }

  async _load() {
    const loadedEvents = await this._storage.getItem(EVENTS_KEY)
    if (loadedEvents) {
      loadedEvents.forEach(this._addEvent.bind(this))
    }
  }

  _shouldPersist(event) {
    return (isDomainEvent(event) && !this._isDuplicate(event))
  }

  _isDuplicate(event) {
    return (
      this._event_ids.has(event.id) ||
      this._events.some(this._isEqualJoinGameEvent.bind(null, event))
    )
  }

  _addEvent(event) {
    this._events.push(event)
    this._event_ids.add(event.id)
  }
}
