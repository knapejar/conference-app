<template>
    <MainLayout :pageTitle=store.state.conference.name>
        <ion-img :src=store.state.conference.welcomeImage class="image-responsive" />
        <ion-card>
            <ion-card-header>
                <ion-card-title>Welcome to {{ store.state.conference.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p class="justified-content">{{ store.state.conference.description }}</p>
            </ion-card-content>
        </ion-card>

        <div class="ion-padding"></div>
    </MainLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    
    onMounted(() => {
      if (route.query.i) {
        store.login(route.query.i as string);
      }
    });

    return {
      store,
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
