import { buildAlexaApp } from './index.mjs'

const schema = {
  interactionModel: {
    languageModel: Object.assign(
      { invocationName: 'score card' },
      JSON.parse(buildAlexaApp({}).schemas.skillBuilder())
    )
  }
}

console.log(JSON.stringify(schema, null, 2))
