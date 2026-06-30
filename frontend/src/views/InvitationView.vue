<template>
  <div class="invitation">
    <SideToolbar />
    <CoverHero />
    <AboutUs />
    <OurTimeline />
    <InterviewSection />
    <WeddingDay />
    <LocationSection />
    <SectionPhoto
      :image-path="assets.midPhoto"
      alt="middle section photo"
      :placeholder-label="t.sectionPhoto.midHint"
    />
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
import InterviewSection from '../components/InterviewSection.vue'
import WeddingDay from '../components/WeddingDay.vue'
import LocationSection from '../components/LocationSection.vue'
import SectionPhoto from '../components/SectionPhoto.vue'
import GallerySection from '../components/GallerySection.vue'
import InformationSection from '../components/InformationSection.vue'
import GuestbookSection from '../components/GuestbookSection.vue'
import AccountSection from '../components/AccountSection.vue'
import RsvpForm from '../components/RsvpForm.vue'
import GuestGallery from '../components/GuestGallery.vue'
import EndingSection from '../components/EndingSection.vue'
import { useInvitationContent } from '../composables/useInvitationContent'

const { assets, t } = useInvitationContent()
</script>

<style scoped>
.invitation {
  max-width: var(--section-max-width);
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 48px rgba(244, 167, 185, 0.1);
}
</style>
