<template>
  <MaintenanceScreen v-if="siteMaintenance && route.name !== 'admin'" />
  <template v-else>
    <RouterView />
    <IntroSplash
      v-if="showSplash && route.name !== 'admin'"
      @complete="onSplashComplete"
    />
  </template>
</template>

<script setup>
import { provide, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import IntroSplash from './components/IntroSplash.vue'
import MaintenanceScreen from './components/MaintenanceScreen.vue'
import { SITE_MAINTENANCE } from './config/site'

const route = useRoute()
const siteMaintenance = SITE_MAINTENANCE
const showSplash = ref(true)
const invitationReady = ref(false)

provide('invitationReady', invitationReady)

function onSplashComplete() {
  showSplash.value = false
  invitationReady.value = true
}

watch(
  () => route.name,
  (name) => {
    if (name === 'admin') {
      showSplash.value = false
      invitationReady.value = true
    }
  },
  { immediate: true },
)
</script>
