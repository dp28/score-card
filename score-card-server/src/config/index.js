const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
console.log(`Running with "${env}" environment config`)
const config = require(`./${env}.json`)

export default config
