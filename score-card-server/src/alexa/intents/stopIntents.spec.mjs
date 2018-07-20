import { buildAlexaMocks } from '../alexaSpecHelper.mjs'
import { buildStopIntent, buildCancelIntent } from './stopIntents.mjs'
import Config from '../../config'

describe('AMAZON.StopIntent', () => {
  let intent
  let request
  let response

  beforeEach(() => {
    const mocks = buildAlexaMocks()
    request = mocks.request
    response = mocks.response
    intent = buildStopIntent()
  })

  describe('the intent name', () => {
    it('should be "AMAZON.StopIntent"', () => {
      expect(intent.name).toEqual('AMAZON.StopIntent')
    })
  })

  describe('#requestHandler', () => {
    beforeEach(() => { intent.requestHandler(request, response) })

    it('should not keep the session running', () => {
      expect(response.shouldEndSession.mock.calls).toEqual([[true]])
    })

    it('should tell the user goodbye', () => {
      expect(response.asText()).toMatch(/bye/i)
    })
  })
})


describe('AMAZON.CancelIntent', () => {
  let intent
  let request
  let response

  beforeEach(() => {
    const mocks = buildAlexaMocks()
    request = mocks.request
    response = mocks.response
    intent = buildCancelIntent()
  })

  describe('the intent name', () => {
    it('should be "AMAZON.CancelIntent"', () => {
      expect(intent.name).toEqual('AMAZON.CancelIntent')
    })
  })

  describe('#requestHandler', () => {
    beforeEach(() => { intent.requestHandler(request, response) })

    it('should not keep the session running', () => {
      expect(response.shouldEndSession.mock.calls).toEqual([[true]])
    })

    it('should tell the user goodbye', () => {
      expect(response.asText()).toMatch(/bye/i)
    })
  })
})
