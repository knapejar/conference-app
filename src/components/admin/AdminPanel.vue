<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Admin Moderation</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <AdminPanelSettings />
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import AdminPanelSettings from '@/components/admin/AdminPanelSettings.vue';

export default defineComponent({
    components: {
        AdminPanelSettings,
    },
    setup() {
        const store = useStore();

        return {
            store,
        };
    },
});
</script>