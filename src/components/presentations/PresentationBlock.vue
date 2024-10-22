<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ block.blockName }}</ion-card-title>
      <ion-card-subtitle>
        {{ blockTime(block) }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-list>
        <PresentationItem
          v-for="(presentation, index) in block.presentations"
          :key="index"
          :presentation="presentation"
        />
      </ion-list>
    </ion-card-content>
  </ion-card>
</template>

<script>
export default {
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  methods: {
    blockTime(block) {
      const startTime = block.presentations[0]?.start || '';
      const endTime = block.presentations[block.presentations.length - 1]?.end || '';
      return `${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}`;
    }
  }
}
</script>
