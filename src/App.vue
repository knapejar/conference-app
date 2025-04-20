<template>
  <addIcons />
  <ion-app>
    <ion-router-outlet />
    <OfflineWarning />
    <ErrorOccured />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
