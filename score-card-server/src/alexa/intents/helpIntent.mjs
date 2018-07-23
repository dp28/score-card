import Config from '../../config'

const oneline = strings => strings.join(' ').replace(/\s+/g, ' ')

const HelpMessage = oneline`
  You can join an existing game, ask for the current scores, and add to a
  player's score. I've sent instructions on how to create a new game to your
  device. What would you like to do now?
`

export function buildHelpIntent() {
  return {
    name: 'AMAZON.HelpIntent',
    schema: {
      slots: {},
      utterances: []
    },
    requestHandler: (_request, response) => {
      response.shouldEndSession(false)
      response.say(HelpMessage)
      response.card({
        type: 'Standard',
        title: 'Score Card Help',
        text: `Visit ${Config.ROOT_URL} to create a new game and get a live score card`
      })
    }
  }
}
