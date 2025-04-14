<template>
    <MainLayout :pageTitle="conference.name">
        <ion-img :src="conference.welcomeImage" class="image-responsive" />
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ conference.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p class="justified-content">{{ conference.description }}</p>
            </ion-card-content>
        </ion-card>

        <StarredPresentations />

        <div class="ion-padding"></div>
    </MainLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    
    const conference = computed(() => store.state.conference);
    
    onMounted(() => {
      if (route.query.i) {
        store.dispatch('conference/login', route.query.i as string);
      }
    });

    return {
      store,
      conference
    };
  },
});
</script>

<style scoped>
.justified-content {
    text-align: justify;
}
.image-responsive {
    width: 100%;
    height: auto;
}
</style>
