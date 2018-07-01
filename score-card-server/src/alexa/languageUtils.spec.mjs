import { buildReadableList } from './languageUtils.mjs'

describe('buildReadableList', () => {
  describe('when the list is empty', () => {
    it('should return null', () => {
      expect(buildReadableList([])).toBeNull()
    })

    describe('but an "ifEmpty" property is specified', () => {
      it('should return the "ifEmpty" property', () => {
        expect(buildReadableList([], { ifEmpty: 'hi' })).toEqual('hi')
      })
    })
  })

  describe('when there is one item in the list', () => {
    it('should return the single item', () => {
      expect(buildReadableList(['test'])).toEqual('test')
    })
  })

  describe('when there are two items in the list', () => {
    it('should return them both joined with " and "', () => {
      expect(buildReadableList(['test', 'two'])).toEqual('test and two')
    })
  })

  describe('when there are three items in the list', () => {
    it('should return the first two joined with a comma then joined with' +
      '" and " with the last', () => {
      expect(buildReadableList(['test', 'two', 'three'])).toEqual('test, two and three')
    })
  })

  describe('when there are four items in the list', () => {
    it('should return the first three joined by commas then joined with' +
      '" and " with the last', () => {
      expect(buildReadableList(['another', 'test', 'two', 'three'])).toEqual(
        'another, test, two and three'
      )
    })
  })
})
