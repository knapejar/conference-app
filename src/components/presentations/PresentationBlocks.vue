<template>
    <div>
      <div :inset="true">
        <PresentationBlock
          v-for="(block, index) in blocks"
          :key="index"
          :block="block"
        />
      </div>
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
  