import { itShouldBehaveLikeASessionIntent } from '../alexaSpecHelper.mjs'
import { buildGetTotalsIntent } from './getTotalsIntent.mjs'

describe('GetTotalsIntent#requestHandler', () => {
  itShouldBehaveLikeASessionIntent({
    buildIntent: buildGetTotalsIntent,
    buildDomain: () => ({
      selectTotals: jest.fn()
    }),

    whenThereIsAGame: ({ getMocks, callIntent, getDomain }) => {
      it('should close the session', async () => {
        getDomain().selectTotals.mockReturnValue([])
        await callIntent()
        return expect(getMocks().response.shouldEndSession.mock.calls).toEqual([[true]])
      })

      describe('without any players', () => {
        it('should tell the user no players are in the game', async () => {
          getDomain().selectTotals.mockReturnValue([])
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(/no players/)
        })
      })

      describe('with one player', () => {
        it('should tell the user the player\'s total', async () => {
          getDomain().selectTotals.mockReturnValue([{ playerName: 'Daniel', total: 21 }])
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(/Daniel has 21 points/)
        })
      })

      describe('with two players', () => {
        it('should tell the user the players\' totals, separated by "and"', async () => {
          getDomain().selectTotals.mockReturnValue([
            { playerName: 'Daniel', total: 21 },
            { playerName: 'John', total: 22 },
          ])
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(/Daniel has 21 points and John has 22 points/)
        })
      })

      describe('with three or more players', () => {
        it('should tell the user the players\' totals, comma separated but "and" for the last two', async () => {
          getDomain().selectTotals.mockReturnValue([
            { playerName: 'Daniel', total: 21 },
            { playerName: 'John', total: 22 },
            { playerName: 'Joe', total: 32 }
          ])
          await callIntent()
          return expect(getMocks().response.asText()).toMatch(
            /Daniel has 21 points, John has 22 points and Joe has 32/
          )
        })
      })
    }
  })
})
