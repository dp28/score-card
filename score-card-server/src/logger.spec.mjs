import * as logger from './logger.mjs'

describe('log', () => {
  const realConsoleLog = global.console.log
  const realSuppressLogging = process.env.SUPPRESS_LOGGING

  beforeEach(() => {
    global.console.log = jest.fn()
  })
  afterEach(() => {
    global.console.log = realConsoleLog
    process.env.SUPPRESS_LOGGING = realSuppressLogging
  })

  it('should delegate everything to console.log', () => {
    process.env.SUPPRESS_LOGGING = 'false'
    logger.log('a', 'b', 'c')
    expect(global.console.log.mock.calls).toEqual([['a', 'b', 'c']])
  })

  it('should not delegate to console.log SUPPRESS_LOGGING environment var is true', () => {
    process.env.SUPPRESS_LOGGING = 'true'
    logger.log('a', 'b', 'c')
    expect(global.console.log.mock.calls.length).toEqual(0)
  })
})
