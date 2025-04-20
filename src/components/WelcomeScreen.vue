<template>
  <ion-page>
    <ion-content class="ion-padding">
      <!-- First Welcome Screen -->
      <div v-if="!hasSeenFirstScreen" class="welcome-container">
        <h1>Vítejte na konferenci!</h1>
        <p>Pro úspěšné nainstalování této aplikace prosím otevřete tento odkaz v prohlížeči Chrome nebo Safari.</p>
        
        <div class="button-container">
          <ion-button expand="block" color="primary" @click="installApp">
            Nainstalovat aplikaci
          </ion-button>
          <ion-button expand="block" fill="outline" @click="continueToBrowser">
            Používat v prohlížeči
          </ion-button>
        </div>
      </div>

      <!-- Second Welcome Screen -->
      <div v-else-if="!hasCompletedSetup" class="welcome-container">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonButton, IonItem, IonLabel, IonInput } from '@ionic/vue'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const hasSeenFirstScreen = ref(false)
const hasCompletedSetup = ref(false)
const userName = ref('')

onMounted(() => {
  // Check if user has completed setup
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    hasCompletedSetup.value = !!settings.name
    hasSeenFirstScreen.value = true
  }
})

const installApp = () => {
  // TODO: Implement PWA installation logic
  hasSeenFirstScreen.value = true
}

const continueToBrowser = () => {
  hasSeenFirstScreen.value = true
}

const completeSetup = async () => {
  if (userName.value) {
    await store.dispatch('settings/updateUserSetting', { key: 'name', value: userName.value })
    router.push('/') // Redirect to main app
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

.button-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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