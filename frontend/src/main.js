import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const FONT_SPECS = [
  '300 1em MaruBuri',
  '400 1em MaruBuri',
  '600 1em MaruBuri',
]

async function waitForFonts() {
  try {
    await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec)))
    await document.fonts.ready
  } catch {
    // proceed with fallback if font files fail to load
  }
}

waitForFonts().then(() => {
  createApp(App).use(router).mount('#app')
})
