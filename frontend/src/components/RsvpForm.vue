<template>
  <section id="rsvp" class="rsvp section section--accent">
    <SectionHeader
      :eyebrow="t.rsvp.eyebrow"
      :title="t.rsvp.title"
      :desc="t.rsvp.desc"
    />

    <RsvpFormContent />
  </section>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'
import RsvpFormContent from './RsvpFormContent.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useLocale()
</script>
