import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getInvitationBySide } from '../data/invitation'

const VALID_SIDES = ['groom', 'bride']

function normalizeSide(rawSide) {
  const side = typeof rawSide === 'string' ? rawSide.toLowerCase() : ''
  return VALID_SIDES.includes(side) ? side : 'groom'
}

export function useSide() {
  const route = useRoute()

  const side = computed(() => normalizeSide(route.query.side))
  const sideInfo = computed(() => getInvitationBySide(side.value))

  return {
    side,
    sideInfo,
  }
}
