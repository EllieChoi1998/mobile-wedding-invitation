<template>
  <RouterView />
  <IntroSplash v-if="showSplash && route.name !== 'admin'" @complete="showSplash = false" />
</template>

<script setup>
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import IntroSplash from './components/IntroSplash.vue'

const route = useRoute()
const showSplash = ref(true)
</script>
