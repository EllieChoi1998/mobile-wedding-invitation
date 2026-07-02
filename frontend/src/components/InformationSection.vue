<template>
  <section class="information section section--white">
    <SectionHeader :eyebrow="t.information.eyebrow" :title="t.information.title" />

    <div v-if="side === 'groom'" class="information__notice hanji-card">
      <p class="information__notice-text">{{ t.information.flowerNotice }}</p>
    </div>

    <div v-else class="information__bride">
      <article class="information__card hanji-card">
        <header class="information__card-head">
          <span class="information__card-icon" aria-hidden="true">♥</span>
          <h3 class="information__card-title">{{ t.information.bride.waitingRoom.title }}</h3>
        </header>
        <p class="information__card-body">{{ t.information.bride.waitingRoom.body }}</p>
      </article>

      <article class="information__card hanji-card">
        <header class="information__card-head">
          <span class="information__card-icon" aria-hidden="true">♥</span>
          <h3 class="information__card-title">{{ t.information.bride.banquet.title }}</h3>
        </header>

        <ul class="information__floors">
          <li
            v-for="(item, index) in t.information.bride.banquet.floors"
            :key="index"
            class="information__floor"
          >
            <span class="information__floor-badge">{{ floorBadges[index] }}</span>
            <div class="information__floor-content">
              <p class="information__floor-name">{{ item.floor }}</p>
              <p class="information__floor-note">{{ item.note }}</p>
            </div>
          </li>
        </ul>

        <p class="information__callout">{{ t.information.bride.banquet.footer }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'
import { useSide } from '../composables/useSide'
import SectionHeader from './SectionHeader.vue'

const { t } = useLocale()
const { side } = useSide()

const floorBadges = ['2F', '3F']
</script>

<style scoped>
.information__notice {
  max-width: 17.5rem;
  margin: 0 auto;
  padding: 1.5rem 1.375rem;
  background: var(--color-accent);
  text-align: center;
}

.information__notice-text {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 2;
  white-space: pre-line;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

.information__bride {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 21rem;
  margin: 0 auto;
}

.information__card {
  padding: 1.25rem 1.125rem 1.125rem;
  background: #fff;
  box-shadow: 0 2px 14px rgba(var(--color-primary-rgb), 0.13);
}

.information__card-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: -0.25rem 0 0.875rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.information__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb), 0.18);
  font-size: 0.5625rem;
  line-height: 1;
  color: var(--color-primary-dark);
}

.information__card-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-primary-dark);
  letter-spacing: 0.01em;
}

.information__card-body {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.9;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

.information__floors {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.information__floor {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.8125rem 0.875rem;
  border-radius: 12px;
  background: var(--color-accent);
}

.information__floor-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--color-primary), var(--color-primary-dark));
  font-family: var(--font-serif);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  box-shadow: 0 2px 6px rgba(var(--color-primary-rgb), 0.35);
}

.information__floor-content {
  flex: 1;
  min-width: 0;
  padding-top: 0.125rem;
}

.information__floor-name {
  margin: 0 0 0.25rem;
  font-family: var(--font-serif);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--color-text);
}

.information__floor-note {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.information__callout {
  margin: 0.875rem 0 0;
  padding: 0.8125rem 0.875rem 0.8125rem 1rem;
  border-radius: 10px;
  border-left: 3px solid rgba(var(--color-primary-rgb), 0.55);
  background: rgba(var(--color-primary-rgb), 0.07);
  font-family: var(--font-serif);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
}
</style>
