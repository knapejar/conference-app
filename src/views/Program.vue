<template>
  <MainLayout :pageTitle="conferenceData.name">
    <div v-if="loading && !hasCachedData">Loading...</div>
    <div v-else-if="error && !hasCachedData">Error: {{ error }}</div>
    <div v-else>
      <div class="segment-sticky ion-no-border">
        <ion-segment v-model="activeSegment">
          <ion-segment-button value="all">
            <ion-label>Bloky prezentací</ion-label>
          </ion-segment-button>
          <ion-segment-button value="starred">
            <ion-label>Oblíbené prezentace</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

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
import { defineComponent, computed, ref } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore';

export default defineComponent({
  setup() {
    const store = useStore();
    const activeSegment = ref('all');
    
    const conferenceData = computed(() => store.getters['conference/getConferenceData']);
    const blocks = computed(() => store.getters['presentations/getBlocks']);
    const loading = computed(() => store.getters['presentations/isLoading']);
    const error = computed(() => store.getters['presentations/getError']);
    const hasCachedData = computed(() => blocks.value && blocks.value.length > 0);

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

<style scoped>
.segment-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--ion-background-color, #fff);
}
</style>