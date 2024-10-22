<template>
  <ion-list>
      <QuestionsListItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @like="likeMessage(message.id)"
      />
  </ion-list>
</template>

<script>
export default {
  props: {
      messages: {
          type: Array,
          required: true
      }
  },
  methods: {
      likeMessage(id) {
          this.$emit('like', id);
      }
  }
};
</script>
