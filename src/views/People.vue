<template>
    <MainLayout :pageTitle="conferenceData.name">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error }}</div>
        <div v-else>
            <PeopleList :people="people" />
        </div>
    </MainLayout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore';

export default defineComponent({
  setup() {
    const store = useStore();
    
    const conferenceData = computed(() => store.getters['conference/getConferenceData']);
    const people = computed(() => store.getters['people/getPeople']);
    const loading = computed(() => store.getters['people/isLoading']);
    const error = computed(() => store.getters['people/getError']);

    return {
      conferenceData,
      people,
      loading,
      error
    };
  },
});
</script>