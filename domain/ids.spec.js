const { generateId } = require('./ids')

describe('generateId', () => {
  it('should return a string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('should be unique', () => {
    expect(generateId()).not.toEqual(generateId())
  })
})
