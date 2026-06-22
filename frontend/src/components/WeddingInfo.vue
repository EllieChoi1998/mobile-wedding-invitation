<template>
  <section class="wedding-info">
    <h2 class="wedding-info__title">{{ t.weddingInfo.title }}</h2>
    <dl class="wedding-info__list">
      <div class="wedding-info__item">
        <dt>{{ t.weddingInfo.date }}</dt>
        <dd>
          {{ wedding.date }} ({{ wedding.dayNote }})<br />
          {{ wedding.time }}
        </dd>

        <div class="wedding-calendar">
          <p class="wedding-calendar__month">{{ calendarLabel }}</p>
          <div class="wedding-calendar__weekdays">
            <span v-for="label in weekdays" :key="label" class="wedding-calendar__weekday">{{ label }}</span>
          </div>
          <div class="wedding-calendar__grid">
            <span
              v-for="(cell, index) in calendarCells"
              :key="index"
              class="wedding-calendar__cell"
              :class="{ 'wedding-calendar__cell--empty': cell === null }"
            >
              <span
                v-if="cell !== null"
                class="wedding-calendar__day"
                :class="{ 'wedding-calendar__day--wedding': cell === wedding.calendar.day }"
              >
                <span v-if="cell === wedding.calendar.day" class="wedding-calendar__heart-ring">
                  <span class="wedding-calendar__heart-icon">♥</span>
                  {{ cell }}
                </span>
                <template v-else>{{ cell }}</template>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="wedding-info__item">
        <dt>{{ t.weddingInfo.venue }}</dt>
        <dd>{{ wedding.venue }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'

const { wedding, calendarLabel, weekdays, t } = useInvitationContent()

const calendarCells = computed(() => {
  const { year, month } = wedding.value.calendar
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  return cells
})
</script>

<style scoped>
.wedding-info {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.wedding-info__title {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.wedding-info__list {
  margin: 0;
}

.wedding-info__item {
  padding: 1.25rem 0;
  border-top: 1px solid rgba(244, 167, 185, 0.2);
}

.wedding-info__item:last-child {
  border-bottom: 1px solid rgba(244, 167, 185, 0.2);
}

.wedding-info__item dt {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}

.wedding-info__item dd {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-text);
}

.wedding-calendar {
  margin-top: 1.5rem;
  padding: 1.25rem 1rem;
  border-radius: 16px;
  background: var(--color-accent);
}

.wedding-calendar__month {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.wedding-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.wedding-calendar__weekday {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.wedding-calendar__weekday:first-child {
  color: #e8899e;
}

.wedding-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem 0;
}

.wedding-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
}

.wedding-calendar__cell--empty {
  visibility: hidden;
}

.wedding-calendar__day {
  font-size: 0.8125rem;
  color: var(--color-text);
}

.wedding-calendar__heart-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background: #fff;
  font-weight: 700;
  color: var(--color-primary-dark);
  box-shadow: 0 0 0 3px rgba(244, 167, 185, 0.25);
}

.wedding-calendar__heart-icon {
  position: absolute;
  top: -0.4rem;
  right: -0.35rem;
  font-size: 0.625rem;
  color: var(--color-primary);
  line-height: 1;
}
</style>
