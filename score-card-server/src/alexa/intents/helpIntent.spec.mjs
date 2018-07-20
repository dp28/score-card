import { buildAlexaMocks } from '../alexaSpecHelper.mjs'
import { buildHelpIntent } from './helpIntent.mjs'
import Config from '../../config'

describe('AMAZON.HelpIntent', () => {
  let intent
  let request
  let response

  beforeEach(() => {
    const mocks = buildAlexaMocks()
    request = mocks.request
    response = mocks.response
    intent = buildHelpIntent()
  })

  describe('the intent name', () => {
    it('should be "AMAZON.HelpIntent"', () => {
      expect(intent.name).toEqual('AMAZON.HelpIntent')
    })
  })

  describe('#requestHandler', () => {
    beforeEach(() => { intent.requestHandler(request, response) })

    it('should keep the session running', () => {
      expect(response.shouldEndSession.mock.calls).toEqual([[false]])
    })

    it('should tell the user they can join a game', () => {
      expect(response.asText()).toMatch(/join .*game/)
    })

    it('should tell the user they can get the current scores', () => {
      expect(response.asText()).toMatch(/current score/)
    })

    it('should tell the user they can update a score for a player', () => {
      expect(response.asText()).toMatch(/add .*score/)
    })

    it('should tell the user they can create a game using instructions on the card', () => {
      expect(response.asText()).toMatch(/instructions .*create .*game/)
    })

    it('should send the user a card', () => {
      expect(response.card.mock.calls.length).toEqual(1)
    })

    describe('the card sent to the user', () => {
      let card

      beforeEach(() => { card = response.card.mock.calls[0][0] })

      it('should have a relevant title', () => {
        expect(card.title).toEqual('Score Card Help')
      })

      it('should include the url to the web frontend', () => {
        expect(card.text).toMatch(Config.ROOT_URL)
      })

      it('should be a "Standard" type', () => {
        expect(card.type).toEqual("Standard")
      })
    })
  })
})
