<template>
  <div class="invitation">
    <SideToolbar />
    <CoverHero />
    <WeddingDay />
    <LocationSection />
    <GallerySection />
    <AccountSection />
    <InformationSection />
    <AboutUs />
    <OurTimeline />
    <GuestbookSection />
    <GuestGallery />
    <RsvpForm />
    <EndingSection />

    <RsvpModal :open="rsvpPopupOpen" @close="rsvpPopupOpen = false" />
    <RsvpFloatingButton v-if="!rsvpPopupOpen" @open="rsvpPopupOpen = true" />
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import SideToolbar from '../components/SideToolbar.vue'
import CoverHero from '../components/CoverHero.vue'
import AboutUs from '../components/AboutUs.vue'
import OurTimeline from '../components/OurTimeline.vue'
import WeddingDay from '../components/WeddingDay.vue'
import LocationSection from '../components/LocationSection.vue'
import GallerySection from '../components/GallerySection.vue'
import InformationSection from '../components/InformationSection.vue'
import GuestbookSection from '../components/GuestbookSection.vue'
import AccountSection from '../components/AccountSection.vue'
import RsvpForm from '../components/RsvpForm.vue'
import RsvpModal from '../components/RsvpModal.vue'
import RsvpFloatingButton from '../components/RsvpFloatingButton.vue'
import GuestGallery from '../components/GuestGallery.vue'
import EndingSection from '../components/EndingSection.vue'

const invitationReady = inject('invitationReady', ref(true))
const rsvpPopupOpen = ref(false)
let initialPopupShown = false

watch(
  invitationReady,
  (ready) => {
    if (ready && !initialPopupShown) {
      rsvpPopupOpen.value = true
      initialPopupShown = true
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.invitation {
  max-width: var(--section-max-width);
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 48px rgba(var(--color-primary-rgb), 0.1);
}
</style>
