<template>
    <ion-text class="ion-text-center">
      <h2>Novinky</h2>
    </ion-text>
    <ion-list :inset="true">
      <AnnouncementsBlock
        v-for="(block, index) in blocks"
        :key="index"
        :block="block"
      />
    </ion-list>
  </template>
  
  <script>
import AnnouncementsBlock from './AnnouncementsBlock.vue';

  export default {
    props: {
      blocks: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  