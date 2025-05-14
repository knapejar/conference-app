<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="welcome-container">
        <h1>Vítejte na konferenci!</h1>
        
        <div v-if="isIOS" class="browser-message">
          <p>Pro nejlepší zážitek prosím otevřete tuto aplikaci v Safari:</p>
          <ion-button expand="block" color="primary" @click="openInSafari">
            <ion-icon :icon="safariIcon" slot="start"></ion-icon>
            Otevřít v Safari
          </ion-button>
        </div>

        <div v-else-if="isAndroid || isWindows" class="browser-message">
          <p>Pro nejlepší zážitek prosím otevřete tuto aplikaci v jednom z těchto prohlížečů:</p>
          <div class="browser-buttons">
            <ion-button expand="block" color="primary" @click="openInChrome">
              <ion-icon :icon="chromeIcon" slot="start"></ion-icon>
              Chrome
            </ion-button>
            <ion-button expand="block" color="primary" @click="openInFirefox">
              <ion-icon :icon="firefoxIcon" slot="start"></ion-icon>
              Firefox
            </ion-button>
            <ion-button expand="block" color="primary" @click="openInEdge">
              <ion-icon :icon="edgeIcon" slot="start"></ion-icon>
              Edge
            </ion-button>
          </div>
        </div>

        <div class="button-container">
          <ion-button expand="block" color="primary" @click="installApp" :disabled="!deferredPrompt">
            Nainstalovat aplikaci
          </ion-button>
          <ion-button expand="block" fill="outline" @click="continueToBrowser">
            Používat v prohlížeči
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue'
import { logoChrome, logoFirefox, logoEdge, logoApple } from 'ionicons/icons'

const emit = defineEmits(['continue'])

const deferredPrompt = ref<any>(null)
const isIOS = ref(false)
const isAndroid = ref(false)
const isWindows = ref(false)

// Browser icons
const chromeIcon = logoChrome
const firefoxIcon = logoFirefox
const edgeIcon = logoEdge
const safariIcon = logoApple

onMounted(() => {
  // Detect platform
  const userAgent = navigator.userAgent.toLowerCase()
  isIOS.value = /iphone|ipad|ipod/.test(userAgent)
  isAndroid.value = /android/.test(userAgent)
  isWindows.value = /windows/.test(userAgent)

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

const handleBeforeInstallPrompt = (e: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt.value = e
}

const installApp = async () => {
  if (!deferredPrompt.value) {
    // If the prompt is not available, just continue to the next screen
    emit('continue')
    return
  }

  // Show the install prompt
  deferredPrompt.value.prompt()

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice

  // Clear the deferred prompt
  deferredPrompt.value = null

  // Continue to the next screen regardless of the user's choice
  emit('continue')
}

const continueToBrowser = () => {
  emit('continue')
}

const openInSafari = () => {
  window.location.href = window.location.href.replace(/^https?:\/\//, 'safari://')
}

const openInChrome = () => {
  window.location.href = window.location.href.replace(/^https?:\/\//, 'googlechrome://')
}

const openInFirefox = () => {
  window.location.href = window.location.href.replace(/^https?:\/\//, 'firefox://')
}

const openInEdge = () => {
  window.location.href = window.location.href.replace(/^https?:\/\//, 'microsoft-edge://')
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;
}

.browser-message {
  margin: 2rem 0;
}

.browser-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.button-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

ion-icon {
  margin-right: 8px;
}
</style> 