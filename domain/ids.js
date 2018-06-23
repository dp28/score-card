const { hri: ReadableIds } = require('human-readable-ids')

function generateId() {
  return ReadableIds.random()
}

module.exports = {
  generateId
}
