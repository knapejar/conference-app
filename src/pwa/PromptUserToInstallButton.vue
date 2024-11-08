<template>
    <ion-button v-if="showInstallButton" @click="handleInstall">
      Install App
    </ion-button>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue'
  
  export default {
    setup() {
      const showInstallButton = ref(false)
      const deferredPrompt = ref(null)
  
      const handleInstall = async () => {
        if (deferredPrompt.value) {
          deferredPrompt.value.prompt()
          const { outcome } = await deferredPrompt.value.userChoice
          console.log(`User response to the install prompt: ${outcome}`)
          deferredPrompt.value = null
        }
      }
  
      onMounted(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault()
          deferredPrompt.value = e
          showInstallButton.value = true
        })
  
        window.addEventListener('appinstalled', () => {
          showInstallButton.value = false
        })
      })
  
      return { showInstallButton, handleInstall }
    },
  }
  </script>
  
  <style scoped>
  ion-button {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
  </style>
  