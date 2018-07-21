import { hri as ReadableIds } from 'human-readable-ids'
import uuid from 'cuid'

export function generateId() {
  return uuid()
}

export function generateReadableId() {
  return ReadableIds.random()
}
