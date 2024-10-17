<template>
  <ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-buttons slot="start">
                  <ion-back-button />
              </ion-buttons>
              <ion-title>{{ pageTitle }}</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content>
          <ion-button @click="openModal">Hello</ion-button>
      </ion-content>
  </ion-page>
</template>

<script>
export default {
}
</script>
