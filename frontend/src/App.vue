<template>
  <RouterView />
  <IntroSplash
    v-if="showSplash && route.name !== 'admin'"
    @complete="onSplashComplete"
  />
</template>

<script setup>
import { provide, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import IntroSplash from './components/IntroSplash.vue'

const route = useRoute()
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
