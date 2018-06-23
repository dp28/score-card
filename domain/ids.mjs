import { hri as ReadableIds } from 'human-readable-ids'

export function generateId() {
  return ReadableIds.random()
}
