<template>
  <ion-buttons slot="start">
    <ion-button @click="navigateToSettings">
      <ion-icon name="person-circle"></ion-icon>
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