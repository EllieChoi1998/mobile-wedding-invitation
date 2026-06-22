<template>
  <div class="side-toolbar">
    <nav class="side-toolbar__sides" :aria-label="t.sideNavLabel">
      <RouterLink
        :to="{ path: '/', query: queryForSide('groom') }"
        class="side-toolbar__tab"
        :class="{ 'side-toolbar__tab--active': side === 'groom' }"
      >
        {{ t.side.groom }}
      </RouterLink>
      <RouterLink
        :to="{ path: '/', query: queryForSide('bride') }"
        class="side-toolbar__tab"
        :class="{ 'side-toolbar__tab--active': side === 'bride' }"
      >
        {{ t.side.bride }}
      </RouterLink>
    </nav>

    <nav v-if="side === 'bride'" class="side-toolbar__lang" aria-label="Language">
      <RouterLink
        :to="{ path: '/', query: queryForLocale('ko') }"
        class="side-toolbar__lang-link"
        :class="{ 'side-toolbar__lang-link--active': !isEnglish }"
      >
        KO
      </RouterLink>
      <RouterLink
        :to="{ path: '/', query: queryForLocale('en') }"
        class="side-toolbar__lang-link"
        :class="{ 'side-toolbar__lang-link--active': isEnglish }"
      >
        EN
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useSide } from '../composables/useSide'
import { useLocale } from '../composables/useLocale'

const { side } = useSide()
const { t, isEnglish, queryForSide, queryForLocale } = useLocale()
</script>

<style scoped>
.side-toolbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem var(--section-pad-x);
  background: rgba(255, 251, 252, 0.92);
  border-bottom: 1px solid rgba(244, 167, 185, 0.2);
  backdrop-filter: blur(8px);
}

.side-toolbar__sides {
  display: flex;
  flex: 1;
  gap: 0.375rem;
  padding: 0.2rem;
  border-radius: 999px;
  background: rgba(255, 240, 243, 0.9);
  border: 1px solid rgba(244, 167, 185, 0.25);
}

.side-toolbar__tab {
  flex: 1;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  color: var(--color-text-muted);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.side-toolbar__tab--active {
  background: #fff;
  color: var(--color-primary-dark);
  box-shadow: 0 1px 4px rgba(244, 167, 185, 0.25);
}

.side-toolbar__lang {
  display: flex;
  flex-shrink: 0;
  gap: 0.25rem;
}

.side-toolbar__lang-link {
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  color: var(--color-text-muted);
  border: 1px solid rgba(244, 167, 185, 0.3);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.side-toolbar__lang-link--active {
  color: var(--color-primary-dark);
  border-color: var(--color-primary);
  background: var(--color-accent);
}
</style>
