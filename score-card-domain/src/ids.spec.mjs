import { generateId, generateReadableId } from './ids'

describe('generateId', () => {
  it('should return a string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('should be unique', () => {
    expect(generateId()).not.toEqual(generateId())
  })
})

describe('generateReadableId', () => {
  it('should return a string', () => {
    expect(typeof generateReadableId()).toBe('string')
  })

  it('should be unique', () => {
    expect(generateReadableId()).not.toEqual(generateId())
  })

  it('should only contain letters, numbers and dashes', () => {
    expect(generateReadableId()).toMatch(/^[\w\d-]+$/)
  })
})
