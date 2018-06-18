const { generateId } = require('./ids.js')

describe('generateId', () => {
  it('should return a string', () => {
    expect(generateId() instanceof String).toBe(true)
  })

  it('should be unique', () => {
    expect(generateId()).not.toEqual(generateId())
  })
})
