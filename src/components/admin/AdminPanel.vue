<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Admin Panel</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <AdminPanelLogin v-if="!isAuthenticated" />
            <AdminPanelSettings v-else />
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/vue';
import AdminPanelLogin from './AdminPanelLogin.vue';
import AdminPanelSettings from '@/components/admin/AdminPanelSettings.vue';

export default defineComponent({
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        AdminPanelLogin,
        AdminPanelSettings,
    },
    setup() {
        const store = useStore();

        const isAuthenticated = computed(() => store.getters['admin/isAuthenticated']);

        onMounted(async () => {
            // Always verify access on mount, regardless of isAuthenticated state
            await store.dispatch('admin/verifyAccess');
        });

        return {
            isAuthenticated
        };
    },
});
</script>

<style scoped>
ion-content {
    --background: var(--ion-color-light);
}
</style>