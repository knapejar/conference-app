<template>
    <ion-refresher slot="fixed" @ionRefresh="handlePullToRefresh">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
</template>

<script>
import { useStore } from '@/composables/useVuexStore';

export default {
    setup() {
        const store = useStore();

        const handlePullToRefresh = async (event) => {
            try {
                // Refresh all stores except questions
                await Promise.all([
                    store.dispatch('conference/fetchConferenceData'),
                    store.dispatch('announcements/fetchAnnouncements'),
                    store.dispatch('people/fetchPeople'),
                    store.dispatch('presentations/fetchPresentations')
                ]);
            } catch (error) {
                console.error('Failed to refresh data:', error);
            } finally {
                // Complete the refresher
                event.detail.complete();
            }
        };

        return {
            handlePullToRefresh
        };
    }
};
</script> 