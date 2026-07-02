<template>
  <section id="rsvp" class="rsvp section section--accent">
    <SectionCornerPatterns :show-bottom-left="false" />
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
import SectionCornerPatterns from './SectionCornerPatterns.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useLocale()
</script>
