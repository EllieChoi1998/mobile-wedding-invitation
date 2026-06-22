<template>
  <div class="invitation">
    <SideToolbar />
    <InvitationHero />
    <WeddingInfo />
    <WeddingPhotos />
    <ParentsSection />
    <RsvpForm />
    <GuestGallery />
  </div>
</template>

<script setup>
import SideToolbar from '../components/SideToolbar.vue'
import InvitationHero from '../components/InvitationHero.vue'
import WeddingInfo from '../components/WeddingInfo.vue'
import WeddingPhotos from '../components/WeddingPhotos.vue'
import ParentsSection from '../components/ParentsSection.vue'
import RsvpForm from '../components/RsvpForm.vue'
import GuestGallery from '../components/GuestGallery.vue'
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
