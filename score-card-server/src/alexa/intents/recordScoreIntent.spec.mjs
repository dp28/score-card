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
        beforeEach(() => {
          getDomain().selectPlayerByName.mockReturnValue(null)
          callIntent()
        })

        it('should tell the user no players are in the game', () => {
          expect(getMocks().response.asText()).toMatch(/can't find a player/)
        })

        it('should tell the player name interpreted', () => {
          expect(getMocks().response.asText()).toMatch(/Joe/)
        })
      })

      describe('when the player is in the game', () => {
        const playerId = 'fakeId'

        beforeEach(() => {
          getDomain().selectPlayerByName.mockReturnValue({ id: playerId })
        })

        it('should call the recordScore event builder with game id, player id and score', () => {
          getMocks().gameManager.getCurrentGameState.mockReturnValue({ id: 'b' })
          callIntent()
          expect(getDomain().recordScore.mock.calls).toEqual([[{
            playerId,
            score: 21,
            gameId: 'b',
          }]])
        })

        it('should dispatch a recordScore event for the player and score', () => {
          const event = { a: 1 }
          getDomain().recordScore.mockReturnValue(event)
          callIntent()
          expect(getMocks().gameManager.addGameEvent.mock.calls).toEqual([[event]])
        })

        it('should repeat the interpreted score in case it was wrong', () => {
          callIntent()
          expect(getMocks().response.asText()).toMatch(/21/)
        })

        it('should return the player\'s new total', () => {
          getDomain().selectPlayerTotal.mockReturnValue(43)
          callIntent()
          expect(getMocks().response.asText()).toMatch(/43/)
        })
      })
    }
  })
})
