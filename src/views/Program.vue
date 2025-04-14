<template>
  <MainLayout :pageTitle="conferenceData.name">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <PresentationBlocks :blocks="blocks" />
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/composables/useVuexStore';

export default defineComponent({
  setup() {
    const store = useStore();
    
    const conferenceData = computed(() => store.getters['conference/getConferenceData']);
    const blocks = computed(() => store.getters['presentations/getBlocks']);
    const loading = computed(() => store.getters['presentations/isLoading']);
    const error = computed(() => store.getters['presentations/getError']);

    onMounted(() => {
      console.log('Program view mounted');
      console.log('Conference data:', conferenceData.value);
      console.log('Blocks:', blocks.value);
    });

    return {
      conferenceData,
      blocks,
      loading,
      error
    };
  },
});
</script>