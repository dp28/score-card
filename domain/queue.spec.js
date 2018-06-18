const { buildQueue } = require('./queue')

describe('a queue', () => {
  const queue = buildQueue()

  describe('#publish', () => {
    it('should return a promise resolving to true', async () => {
      expect(await queue.publish({ eventType: 'fake' })).toEqual(true)
    })

    describe('if there are multiple subscribers to the eventType', () => {
      it('should call all subscribers and return a promise for them to have been called', async () => {
        let callCount = 0
        let buildSubscriber = () => () => callCount++
        queue.subscribe('fake', buildSubscriber())
        queue.subscribe('fake', buildSubscriber())
        await queue.publish({ eventType: 'fake' })
        expect(callCount).toBe(2)
      })

      it('should call all them asynchronously', () => {
        let callCount = 0
        let buildSubscriber = () => () => callCount++
        queue.subscribe('fake', buildSubscriber())
        queue.subscribe('fake', buildSubscriber())
        queue.publish({ eventType: 'fake' })
        expect(callCount).toBe(0)
      })
    })

    describe('if the event does not have an event type', () => {
      it('should throw an error', () => {
        expect(() => queue.publish({})).toThrow()
      })
    })
  })

  describe('#subscribe', () => {
    it('should return a function', () => {
      expect(queue.subscribe('fake', () => 'fail') instanceof Function).toBe(true)
    })

    describe('the returned function', () => {
      it('should cancel the subscription', async () => {
        let hasBeenCalled = false
        const cancel = queue.subscribe('fake', () => hasBeenCalled = true)
        cancel()
        await queue.publish({ eventType: 'fake' })
        expect(hasBeenCalled).toBe(false)
      })
    })

    describe('when an event is published', () => {
      it('should be passed to the subscriber', async () => {
        const event = { eventType: 'fake', specific: 'data' }
        let arg = null
        queue.subscribe('fake', event => arg = event)
        await queue.publish(event)
        expect(arg).toBe(event)
      })

      describe('and is the correct type', () => {
        it('should call the subscriber', async () => {
          let hasBeenCalled = false
          queue.subscribe('fake', () => hasBeenCalled = true)
          await queue.publish({ eventType: 'fake' })
          expect(hasBeenCalled).toBe(true)
        })
      })

      describe('and is not the correct type', () => {
        it('should not call the subscriber', async () => {
          let hasBeenCalled = false
          queue.subscribe('fake', () => hasBeenCalled = true)
          await queue.publish({ eventType: 'still fake' })
          expect(hasBeenCalled).toBe(false)
        })
      })
    })
  })
})
