<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="welcome-container">
        <h1>Nastavení profilu</h1>
        <ion-item>
          <ion-label position="stacked">Vaše jméno</ion-label>
          <ion-input v-model="userName" placeholder="Zadejte vaše jméno"></ion-input>
        </ion-item>

        <div class="gdpr-text">
          <p>Pro zpracování vašich osobních údajů potřebujeme váš souhlas. Vaše jméno bude zobrazeno u vašich otázek během konference.</p>
          <p>Vaše údaje budou zpracovávány v souladu s naší politikou ochrany osobních údajů.</p>
        </div>

        <ion-button expand="block" color="primary" :disabled="!userName" @click="completeSetup">
          Souhlasím a pokračovat
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { requestNotificationPermission } from '@/utils/notifications'

const router = useRouter()
const store = useStore()
const userName = ref('')

const completeSetup = async () => {
  if (userName.value) {
    await store.dispatch('settings/updateUserSetting', { key: 'name', value: userName.value })
    // Request notification permission after profile setup
    await requestNotificationPermission()
    router.replace('/') // Replace current history entry instead of adding a new one
  }
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

.gdpr-text {
  margin: 2rem 0;
  text-align: left;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

ion-input {
  margin-top: 0.5rem;
}
</style> 