import { itShouldBehaveLikeASessionIntent } from '../alexaSpecHelper.mjs'
import { buildGetTotalsIntent } from './getTotalsIntent.mjs'

describe('GetTotalsIntent#requestHandler', () => {
  itShouldBehaveLikeASessionIntent({
    buildIntent: buildGetTotalsIntent,
    buildDomain: () => ({
      selectTotals: jest.fn()
    }),

    whenThereIsAGame: ({ getMocks, callIntent, getDomain }) => {
      describe('without any players', () => {
        it('should tell the user no players are in the game', () => {
          getDomain().selectTotals.mockReturnValue([])
          callIntent()
          expect(getMocks().response.asText()).toMatch(/no players/)
        })
      })

      describe('with one player', () => {
        it('should tell the user the player\'s total', () => {
          getDomain().selectTotals.mockReturnValue([{ playerName: 'Daniel', total: 21 }])
          callIntent()
          expect(getMocks().response.asText()).toMatch(/Daniel has 21 points/)
        })
      })

      describe('with two players', () => {
        it('should tell the user the players\' totals, separated by "and"', () => {
          getDomain().selectTotals.mockReturnValue([
            { playerName: 'Daniel', total: 21 },
            { playerName: 'John', total: 22 },
          ])
          callIntent()
          expect(getMocks().response.asText()).toMatch(/Daniel has 21 points and John has 22 points/)
        })
      })

      describe('with three or more players', () => {
        it('should tell the user the players\' totals, comma separated but "and" for the last two', () => {
          getDomain().selectTotals.mockReturnValue([
            { playerName: 'Daniel', total: 21 },
            { playerName: 'John', total: 22 },
            { playerName: 'Joe', total: 32 }
          ])
          callIntent()
          expect(getMocks().response.asText()).toMatch(
            /Daniel has 21 points, John has 22 points and Joe has 32/
          )
        })
      })
    }
  })
})
