import { log } from '../logger.mjs'

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
log(`Running with "${env}" environment config`)
const config = require(`./${env}.json`)

export default config
