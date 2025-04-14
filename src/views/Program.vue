<template>
  <MainLayout :pageTitle="conferenceData.name">
    <div v-if="loading && !hasCachedData">Loading...</div>
    <div v-else-if="error && !hasCachedData">Error: {{ error }}</div>
    <div v-else>
      <ion-segment v-model="activeSegment">
        <ion-segment-button value="all">
          <ion-label>All Presentations</ion-label>
        </ion-segment-button>
        <ion-segment-button value="starred">
          <ion-label>Starred</ion-label>
        </ion-segment-button>
      </ion-segment>
      
      <div v-if="activeSegment === 'all'">
        <PresentationBlocks :blocks="blocks" />
      </div>
      <div v-else>
        <StarredPresentations />
      </div>
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore';
import StarredPresentations from '@/components/presentations/StarredPresentations.vue';

export default defineComponent({
  components: {
    StarredPresentations
  },
  setup() {
    const store = useStore();
    const activeSegment = ref('all');
    
    const conferenceData = computed(() => store.getters['conference/getConferenceData']);
    const blocks = computed(() => store.getters['presentations/getBlocks']);
    const loading = computed(() => store.getters['presentations/isLoading']);
    const error = computed(() => store.getters['presentations/getError']);
    const hasCachedData = computed(() => blocks.value && blocks.value.length > 0);

    onMounted(() => {
      console.log('Program view mounted');
      console.log('Conference data:', conferenceData.value);
      console.log('Blocks:', blocks.value);
    });

    return {
      conferenceData,
      blocks,
      loading,
      error,
      activeSegment,
      hasCachedData
    };
  },
});
</script>