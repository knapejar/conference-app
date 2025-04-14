<template>
  <ion-buttons slot="end">
    <ion-button @click="navigateToSettings">
      <ion-icon name="settings-outline"></ion-icon>
    </ion-button>
  </ion-buttons>
</template>

<script>
export default {
  name: 'MainLayoutHeaderToolbarSettings',
  methods: {
    navigateToSettings() {
      this.$router.push('/settings')
    }
  }
}
</script> 