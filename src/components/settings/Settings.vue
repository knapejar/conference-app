<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Nastavení uživatele</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Vaše jméno</ion-label>
          <ion-input 
            :value="userSettings.name"
            @ion-input="updateSetting('name', $event.target.value)"
            placeholder="Enter your name"
          ></ion-input>
        </ion-item>
      </ion-list>
      <div class="gdpr-text">
        <p>Vaše jméno bude zobrazeno u vašich otázek během konference. Vaše údaje budou zpracovávány v souladu s naší politikou ochrany osobních údajů.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Settings',
  computed: {
    ...mapState('settings', ['userSettings'])
  },
  methods: {
    ...mapActions('settings', ['updateUserSetting']),
    updateSetting(key, value) {
      this.updateUserSetting({ key, value })
    }
  },
  created() {
    this.$store.dispatch('settings/loadUserSettings')
  }
}
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  margin-bottom: 16px;
}
</style> 