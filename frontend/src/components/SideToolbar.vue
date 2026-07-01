<template>
  <div class="side-toolbar">
    <nav class="side-toolbar__lang" :aria-label="t.langNavLabel">
      <RouterLink
        :to="{ path: '/', query: queryForLocale('ko') }"
        class="side-toolbar__tab"
        :class="{ 'side-toolbar__tab--active': !isEnglish }"
      >
        {{ t.langKo }}
      </RouterLink>
      <RouterLink
        :to="{ path: '/', query: queryForLocale('en') }"
        class="side-toolbar__tab"
        :class="{ 'side-toolbar__tab--active': isEnglish }"
      >
        {{ t.langEn }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const { t, isEnglish, queryForLocale } = useLocale()
</script>

<style scoped>
.side-toolbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.625rem var(--section-pad-x);
  background: rgba(255, 251, 252, 0.92);
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
  backdrop-filter: blur(8px);
}

.side-toolbar__lang {
  display: flex;
  gap: 0.375rem;
  padding: 0.2rem;
  border-radius: 999px;
  background: rgba(255, 240, 243, 0.9);
  border: 1px solid rgba(var(--color-primary-rgb), 0.25);
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
  box-shadow: 0 1px 4px rgba(var(--color-primary-rgb), 0.25);
}
</style>
