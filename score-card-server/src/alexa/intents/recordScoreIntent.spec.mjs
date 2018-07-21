import { itShouldBehaveLikeASessionIntent } from '../alexaSpecHelper.mjs'
import { buildRecordScoreIntent } from './recordScoreIntent.mjs'

describe('RecordScoreIntent#requestHandler', () => {
  itShouldBehaveLikeASessionIntent({
    buildIntent: buildRecordScoreIntent,
    buildDomain: () => ({
      selectPlayerByName: jest.fn(),
      selectPlayerTotal: jest.fn(),
      recordScore: jest.fn()
    }),

    whenThereIsAGame: ({ getMocks, callIntent, getDomain }) => {
      const playerName = 'Joe'
      const score = '21'

      beforeEach(() => {
        getMocks().request.slot = slotName => ({
          PLAYER: playerName,
          SCORE: score
        }[slotName])
      })

      describe('when there is no player in the game with the specified name', () => {
        beforeEach(async () => {
          getDomain().selectPlayerByName.mockReturnValue(null)
          await callIntent()
        })

        it('should tell the user no players are in the game', async () => {
          return expect(getMocks().response.asText()).toMatch(/can't find a player/)
        })

        it('should tell the player name interpreted', async () => {
          return expect(getMocks().response.asText()).toMatch(/Joe/)
        })
      })

      describe('when the player is in the game', () => {
        const playerId = 'fakeId'

        beforeEach(() => {
          getDomain().selectPlayerByName.mockReturnValue({ id: playerId })
        })

        it('should call the recordScore event builder with client id from the session, game id, player id and score', async () => {
          getMocks().gameManager.getCurrentGameState.mockReturnValue(Promise.resolve({ id: 'b' }))
          getMocks().gameManager.getMostRecentGameForClientId.mockReturnValue(Promise.resolve({ id: 'b' }))
          getMocks().request.userId = 'c'
          await callIntent()
          return expect(getDomain().recordScore.mock.calls).toEqual([[{
            playerId,
            score: 21,
            gameId: 'b',
            clientId: 'c'
          }]])
        })

        it('should dispatch a recordScore event for the player and score', async () => {
          const event = { a: 1 }
          getDomain().recordScore.mockReturnValue(event)
          await callIntent()
          return expect(getMocks().gameManager.addGameEvent.mock.calls).toEqual([[event]])
        })

        it('should repeat the interpreted score in case it was wrong', async () => {
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(/21/)
        })

        it('should return the player\'s new total', async () => {
          getDomain().selectPlayerTotal.mockReturnValue(43)
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(/43/)
        })
      })
    }
  })
})
