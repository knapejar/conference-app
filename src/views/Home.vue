<template>
    <UseStore />
    <MainLayout :pageTitle="store.state.conferenceName">
        <ion-img :src="store.state.welcomeImage" class="image-responsive" />
        <ion-card>
            <ion-card-header>
                <ion-card-title>Welcome to {{ store.state.conferenceName }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p class="justified-content">{{ store.state.conferenceDescription }}</p>
            </ion-card-content>
        </ion-card>

        <div class="ion-padding"></div>
        <AnnouncementsBlocks :blocks="store.state.announcements" />
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

<style scoped>
.justified-content {
    text-align: justify;
}
.image-responsive {
    width: 100%;
    height: auto;
}
</style>
