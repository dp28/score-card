import cuid from 'cuid'

export const ClientId = fetchFromLocalStorage('ClientId', cuid)

function fetchFromLocalStorage(key, generateValue) {
  const fetchedValue = global.localStorage.getItem(key)
  if (fetchedValue !== null) {
    return fetchedValue
  }
  const newValue = generateValue()
  global.localStorage.setItem(key, newValue)
  return newValue
}
