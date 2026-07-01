<template>
  <section class="wedding-day section section--white">
    <SectionHeader :eyebrow="t.weddingDay.eyebrow" :title="t.weddingDay.title" />

    <dl class="wedding-day__info">
      <div class="wedding-day__info-row">
        <dt>{{ t.weddingDay.date }}</dt>
        <dd>{{ wedding.date }} ({{ wedding.dayNote }})<br />{{ wedding.time }}</dd>
      </div>
      <div class="wedding-day__info-row">
        <dt>{{ t.weddingDay.venue }}</dt>
        <dd>{{ wedding.venue }}<br />{{ wedding.hall }}</dd>
      </div>
    </dl>

    <div class="countdown">
      <div class="countdown__item hanji-card">
        <span class="countdown__value">{{ pad(countdown.days) }}</span>
        <span class="countdown__label">{{ t.weddingDay.days }}</span>
      </div>
      <div class="countdown__item hanji-card">
        <span class="countdown__value">{{ pad(countdown.hours) }}</span>
        <span class="countdown__label">{{ t.weddingDay.hours }}</span>
      </div>
      <div class="countdown__item hanji-card">
        <span class="countdown__value">{{ pad(countdown.minutes) }}</span>
        <span class="countdown__label">{{ t.weddingDay.minutes }}</span>
      </div>
      <div class="countdown__item hanji-card">
        <span class="countdown__value">{{ pad(countdown.seconds) }}</span>
        <span class="countdown__label">{{ t.weddingDay.seconds }}</span>
      </div>
    </div>

    <p class="wedding-day__countdown-msg">
      {{ countdownMessage }}
    </p>

    <div class="wedding-calendar hanji-card">
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
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { wedding as weddingMeta } from '../data/invitation'
import { useCountdown } from '../composables/useCountdown'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { wedding, calendarLabel, weekdays, t } = useInvitationContent()
const countdown = useCountdown(weddingMeta.dateISO)

function pad(n) {
  return String(n).padStart(2, '0')
}

const countdownMessage = computed(() => {
  const template = countdown.value.isPast
    ? t.value.weddingDay.countdownPast
    : t.value.weddingDay.countdownFuture
  return template.replace('{days}', countdown.value.days)
})

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
.wedding-day {
  text-align: center;
}

.wedding-day__countdown-msg {
  margin: 0 0 1.5rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.wedding-day__info {
  margin: 0 0 1.5rem;
  text-align: center;
}

.wedding-calendar {
  margin-bottom: 1.5rem;
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
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.25);
}

.wedding-calendar__heart-icon {
  position: absolute;
  top: -0.4rem;
  right: -0.35rem;
  font-size: 0.625rem;
  color: var(--color-primary);
  line-height: 1;
}

.wedding-day__info-row {
  padding: 1rem 0;
  border-top: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.wedding-day__info-row:last-child {
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.wedding-day__info-row dt {
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-primary-dark);
}

.wedding-day__info-row dd {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.7;
  color: var(--color-event-venue);
}
</style>
