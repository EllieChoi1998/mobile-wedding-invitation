<template>
  <div class="invitation">
    <SideToolbar />
    <CoverHero />
    <AboutUs />
    <OurTimeline />
    <WeddingDay />
    <LocationSection />
    <GallerySection />
    <InformationSection />
    <RsvpForm />
    <AccountSection />
    <GuestbookSection />
    <GuestGallery />
    <EndingSection />
  </div>
</template>

<script setup>
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
import GuestGallery from '../components/GuestGallery.vue'
import EndingSection from '../components/EndingSection.vue'
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
