export function log(...args) {
  if (process.env.SUPPRESS_LOGGING !== 'true') {
    console.log(...args)
  }
}
