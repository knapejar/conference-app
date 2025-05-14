<template>
<ion-card>
    <ion-card-header>
        <ion-card-title>Oblíbené prezentace</ion-card-title>
    </ion-card-header>
    <div v-if="loading && !hasCachedData">Loading...</div>
    <div v-else-if="error && !hasCachedData">Error: {{ error }}</div>
    <div v-else-if="starredPresentations.length === 0">
      <ion-item>
        <ion-label>Pro přidání prezentace klikněte na hvězdičku u prezentace</ion-label>
      </ion-item>
    </div>
    <div v-else>
      <ion-list>
        <PresentationItem
          v-for="presentation in starredPresentations"
          :key="presentation.id"
          :presentation="presentation"
        />
      </ion-list>
    </div>
  </ion-card>    
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'StarredPresentations',
  setup() {
    const store = useStore();
    
    const starredPresentations = computed(() => {
      return store.getters['presentations/getStarredPresentations'];
    });
    
    const loading = computed(() => {
      return store.getters['presentations/isLoading'];
    });
    
    const error = computed(() => {
      return store.getters['presentations/getError'];
    });
    
    const hasCachedData = computed(() => {
      return store.getters['presentations/getPresentations'].length > 0;
    });
    
    return {
      starredPresentations,
      loading,
      error,
      hasCachedData
    };
  }
};
</script> 