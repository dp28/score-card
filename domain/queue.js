class Queue {

  constructor() {
    this.subscribers = new Map()
  }

  publish(event) {
    const eventType = event.eventType
    if (!eventType) {
      throw new Error('Events must have an "eventType" property')
    }
    if (this.subscribers.has(eventType)) {
      return callAllAsync(this.subscribers.get(eventType), event)
    }
    return Promise.resolve(true)
  }

  subscribe(eventType, subscriber) {
    const specificSubscribers = this.subscribers.get(eventType) || new Set()
    specificSubscribers.add(subscriber)
    this.subscribers.set(eventType, specificSubscribers)
    return () => specificSubscribers.delete(subscriber)
  }
}

function callAllAsync(funcs, argument) {
  const asyncCalls = [...funcs].map(func => callAsync(func, argument))
  return Promise.all(asyncCalls).then(() => true)
}

function callAsync(func, argument) {
  return Promise.resolve(argument).then(func)
}

function buildQueue() {
  return new Queue()
}

module.exports = {
  buildQueue
}
