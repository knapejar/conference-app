<template>
    <div>
      <ion-list :inset="true">
        <PresentationBlock
          v-for="(block, index) in blocks"
          :key="index"
          :block="block"
        />
      </ion-list>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      blocks: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  