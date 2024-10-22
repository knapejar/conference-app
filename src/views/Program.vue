<template>
  <MainLayout :pageTitle="store.state.conferenceName">
    <PresentationBlocks :blocks="store.state.blocks" />
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
});
</script>