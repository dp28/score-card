describe('ClientId', () => {
  let realLocalStorage = global.localStorage

  beforeEach(() => {
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn()
    }
    localStorage.getItem.mockReturnValue(null)
  })

  function fetchClientId({ reloadModule = true } = {}) {
    if (reloadModule) {
      jest.resetModules()
    }
    return require('./id.js').ClientId
  }

  afterEach(() => { global.localStorage = realLocalStorage })

  it('should be a string', () => {
    expect(typeof fetchClientId()).toBe('string')
  })

  it('should try and fetch the id from localStorage', () => {
    fetchClientId()
    expect(global.localStorage.getItem.mock.calls).toEqual([['ClientId']])
  })

  describe('if there is a value in localStorage', () => {
    beforeEach(() => { localStorage.getItem.mockReturnValue('persistedId') })

    it('should be returned', () => {
      expect(fetchClientId()).toEqual('persistedId')
    })

    it('should not set a value in localStorage', () => {
      expect(global.localStorage.setItem.mock.calls.length).toEqual(0)
    })
  })

  describe('if there is not a value in localStorage', () => {
    beforeEach(() => { localStorage.getItem.mockReturnValue(null) })

    it('should return a string', () => {
      expect(typeof fetchClientId()).toEqual('string')
    })

    it('should set the returned value in localStorage', () => {
      const id = fetchClientId()
      expect(global.localStorage.setItem.mock.calls).toEqual([['ClientId', id]])
    })

    describe('if the module is required multiple times (without busting the cache)', () => {
      it('should only look in localStorage once', () => {
        fetchClientId()
        fetchClientId({ reloadModule: false })
        fetchClientId({ reloadModule: false })
        expect(global.localStorage.getItem.mock.calls.length).toEqual(1)
      })

      it('should return the same value each time', () => {
        expect(fetchClientId()).toEqual(fetchClientId({ reloadModule: false }))
      })
    })

    describe('if the module is required multiple times without a cache', () => {
      describe('but the value is saved in localStorage', () => {
        beforeEach(() => { localStorage.getItem.mockReturnValue('persistedId') })
        it('should return the same value each time', () => {
          expect(fetchClientId()).toEqual(fetchClientId())
        })
      })

      describe('and the value is not saved in localStorage', () => {
        beforeEach(() => { localStorage.getItem.mockReturnValue(null) })

        it('should return different values each time', () => {
          expect(fetchClientId()).not.toEqual(fetchClientId())
        })
      })
    })
  })
})
