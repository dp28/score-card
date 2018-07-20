import Config from '../../config'

function buildStopIntentWithName(name) {
  return {
    name,
    schema: {
      slots: {},
      utterances: []
    },
    requestHandler: (_request, response) => {
      response.shouldEndSession(true)
      response.say('Goodbye')
    }
  }
}

export const buildStopIntent = () => buildStopIntentWithName('AMAZON.StopIntent')
export const buildCancelIntent = () => buildStopIntentWithName('AMAZON.CancelIntent')
