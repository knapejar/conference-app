<template>
<ion-card>
    <ion-card-header>
        <ion-card-title>Mé prezentace</ion-card-title>
    </ion-card-header>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
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
import PresentationItem from './PresentationItem.vue';

export default {
  name: 'StarredPresentations',
  components: {
    PresentationItem
  },
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
    
    return {
      starredPresentations,
      loading,
      error
    };
  }
};
</script> 