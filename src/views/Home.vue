<template>
    <MainLayout :pageTitle="store.state.conference.name">
        <ion-img :src="store.state.conference.welcomeImage" class="image-responsive" />
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
import { defineComponent } from 'vue';
import { useStore } from '@/composables/useVuexStore.js';

export default defineComponent({
  setup() {
    const store = useStore();

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
