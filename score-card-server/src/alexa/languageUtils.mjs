export function buildReadableList(list, { ifEmpty = null } = {}) {
  switch (list.length) {
    case 0: return ifEmpty
    case 1: return list[0]
    default: return buildReadableLongList(list)
  }
}

function buildReadableLongList(list) {
  const lastTwoStatements = list.slice(list.length - 2)
  const firstStatements = list.slice(0, list.length - 2)
  const start = firstStatements.map(statement => `${statement}, `).join('')
  const end = lastTwoStatements.join(' and ')
  return start + end
}
