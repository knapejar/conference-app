<template>
  <ion-item>
      <ion-badge>{{ message.likes }}</ion-badge>
      <div style="width: 16px;"></div>
      <ion-label>
          <h2>{{ message.user }}</h2>
          <p>{{ message.text }}</p>
      </ion-label>
      <ion-button @click="likeMessage" fill="clear" slot="end">
          <ion-icon name="thumbs-up" style="font-size: 24px;"></ion-icon>
      </ion-button>
  </ion-item>
</template>

<script>
export default {
  props: {
      message: {
          type: Object,
          required: true
      }
  },
  methods: {
      likeMessage() {
          this.$emit('like');
      }
  }
}
</script>