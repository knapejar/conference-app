<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input 
            :value="userSettings.name"
            @ion-input="updateSetting('name', $event.target.value)"
            placeholder="Enter your name"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input 
            type="email"
            :value="userSettings.email"
            @ion-input="updateSetting('email', $event.target.value)"
            placeholder="Enter your email"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Phone</ion-label>
          <ion-input 
            type="tel"
            :value="userSettings.phone"
            @ion-input="updateSetting('phone', $event.target.value)"
            placeholder="Enter your phone number"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">LinkedIn URL</ion-label>
          <ion-input 
            type="url"
            :value="userSettings.linkedinUrl"
            @ion-input="updateSetting('linkedinUrl', $event.target.value)"
            placeholder="Enter your LinkedIn profile URL"
          ></ion-input>
        </ion-item>
      </ion-list>
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