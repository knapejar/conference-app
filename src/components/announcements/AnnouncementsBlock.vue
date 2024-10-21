<template>
  <ion-card>
    <ion-card-content>
      <p>{{ formattedDate }}</p>
      <p>{{ block.message }}</p>
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
  computed: {
    formattedDate() {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(this.block.date).toLocaleDateString('cs-CZ', options);
    }
  }
}
</script>
