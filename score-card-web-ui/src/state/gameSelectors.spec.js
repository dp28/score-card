import { selectGame, selectPlayer } from './gameSelectors'


describe('selectGame', () => {
  it('should find the game by id', () => {
    const game = { id: 'a' }
    const state = { games: { [game.id]: game } }
    expect(selectGame(game.id, state)).toBe(game)
  })
})

describe('selectPlayer', () => {
  it('should find the player in the game by their ids', () => {
    const player = { id: 'b', name: 'hi' }
    const game = { id: 'a', players: { [player.id]: player } }
    const state = { games: { [game.id]: game } }
    expect(selectPlayer(player.id, game.id, state)).toBe(player)
  })
})
