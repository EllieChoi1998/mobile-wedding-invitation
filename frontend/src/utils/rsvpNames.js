/**
 * Extract individual guest names from an RSVP guestName field.
 * Handles comma/space separators and trailing "외 N인" suffixes.
 * Examples:
 *   "최혜령" → ["최혜령"]
 *   "최혜령 외 1인" → ["최혜령"]
 *   "최혜령,강미선" → ["최혜령", "강미선"]
 *   "최혜령, 강미선 외 1인" → ["최혜령", "강미선"]
 */
export function extractGuestNames(guestName) {
  if (!guestName || typeof guestName !== 'string') return []

  const cleaned = guestName
    .replace(/외\s*\d+\s*인/g, ' ')
    .replace(/외\s*\d+/g, ' ')
    .trim()

  if (!cleaned) return []

  return cleaned
    .split(/[,，\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Returns RSVP ids that share at least one (name + side) pair with another RSVP.
 */
export function findDuplicateRsvpIds(rsvps) {
  const nameSideToIds = new Map()

  for (const rsvp of rsvps) {
    const names = extractGuestNames(rsvp.guestName)
    const side = rsvp.side ?? ''
    for (const name of names) {
      const key = `${side}::${name}`
      if (!nameSideToIds.has(key)) nameSideToIds.set(key, new Set())
      nameSideToIds.get(key).add(rsvp.rsvpId)
    }
  }

  const duplicateIds = new Set()
  for (const ids of nameSideToIds.values()) {
    if (ids.size >= 2) {
      ids.forEach((id) => duplicateIds.add(id))
    }
  }

  return duplicateIds
}
