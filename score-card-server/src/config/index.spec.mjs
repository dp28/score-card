describe('config', () => {
  let env
  let config

  beforeEach(() => {
    jest.resetModules()
    env = process.env.NODE_ENV
    delete process.env.NODE_ENV;
  })

  afterEach(() => { process.env.NODE_ENV = env })

  function importConfigInEnvironment(environment) {
    process.env.NODE_ENV = environment
    return require('./index.js').default
  }

  describe('when the environment is development', () => {
    beforeEach(() => { config = importConfigInEnvironment('development') })

    it('uses the development config', () => {
      const devConfig = require('./development.json')
      expect(config).toEqual(devConfig)
    })
  })

  describe('when the environment is production', () => {
    beforeEach(() => { config = importConfigInEnvironment('production') })

    it('uses the production config', () => {
      const prodConfig = require('./production.json')
      expect(config).toEqual(prodConfig)
    })
  })

  describe('when the environment is not recognised', () => {
    beforeEach(() => { config = importConfigInEnvironment('fake') })

    it('uses the development config', () => {
      const devConfig = require('./development.json')
      expect(config).toEqual(devConfig)
    })
  })
})
