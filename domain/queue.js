class Queue {

  constructor() {
    this.subscribers = []
  }

  publish(event) {
    const eventType = event.eventType
    if (!eventType) {
      throw new Error('Events must have an "eventType" property')
    }
    const applicableSubscribers = filterSubscribers(this.subscribers, event)
    if (applicableSubscribers.length > 0) {
      return callAllAsync(applicableSubscribers, event)
    }
    return Promise.resolve(true)
  }

  subscribe(subscriberFunc, options = {}) {
    const { filter } = options
    const subscriber = { func: subscriberFunc, filter }
    this.subscribers.push(subscriber)
    return () => this.subscribers = this.subscribers.filter(s => s !== subscriber)
  }
}

function filterSubscribers(subscribers, event) {
  return subscribers
    .filter(subscriber => subscriber.filter ? subscriber.filter(event) : true)
    .map(subscriber => subscriber.func)
}

function callAllAsync(funcs, argument) {
  const asyncCalls = funcs.map(func => callAsync(func, argument))
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
