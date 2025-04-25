<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Administrace konference</ion-title>
            </ion-toolbar>
            <ion-toolbar v-if="isAuthenticated">
                <ion-segment v-model="selectedTab">
                    <ion-segment-button value="settings">
                        <ion-label>Konference</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="blocks">
                        <ion-label>Program</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="presenters">
                        <ion-label>Prezentéři</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <AdminPanelLogin v-if="!isAuthenticated" />
            <template v-else>
                <AdminPanelSettings v-if="selectedTab === 'settings'" />
                <ConferenceBlocksManager v-if="selectedTab === 'blocks'" />
                <PresentersManager v-if="selectedTab === 'presenters'" />
            </template>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import PresentersManager from './PresentersManager.vue';

export default defineComponent({
    components: {
        PresentersManager
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const selectedTab = ref(route.query.tab || 'settings');

        const isAuthenticated = computed(() => store.getters['admin/isAuthenticated']);

        onMounted(async () => {
            // Always verify access on mount, regardless of isAuthenticated state
            await store.dispatch('admin/verifyAccess');
        });

        return {
            isAuthenticated,
            selectedTab
        };
    },
});
</script>

<style scoped>
ion-content {
    --background: var(--ion-color-light);
}

ion-segment {
    --background: var(--ion-color-light);
}
</style>