import * as idValues from '../lib/ids.mjs'

export const ID_ADJECTIVES = 'id_adjectives'
export const ID_ANIMALS = 'id_animals'

const CustomSlots = {
  [ID_ADJECTIVES]: idValues.ADJECTIVES,
  [ID_ANIMALS]: idValues.ANIMALS,
}

export function addCustomSlots(alexaApp) {
  Object.entries(CustomSlots).forEach(([slotName, values]) => {
    alexaApp.customSlot(slotName, values)
  })
}
