<template>
  <ion-page>
    <installation-screen v-if="!hasSeenFirstScreen" @continue="hasSeenFirstScreen = true" />
    <profile-setup-screen v-else-if="!hasCompletedSetup" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const hasSeenFirstScreen = ref(false)
const hasCompletedSetup = ref(false)

onMounted(() => {
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    hasCompletedSetup.value = !!settings.name
    hasSeenFirstScreen.value = true
  }
})
</script> 