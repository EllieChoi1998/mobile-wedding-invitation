<template>
  <RouterView />
  <IntroSplash v-if="showSplash" @complete="showSplash = false" />
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import IntroSplash from './components/IntroSplash.vue'

const showSplash = ref(true)
</script>
