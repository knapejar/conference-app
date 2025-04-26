<template>
    <BaseLayout pageTitle="Otázky k prezentaci">
        <ion-refresher slot="fixed" @ionRefresh="handlePullToRefresh">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        
        <AdminQuestionsList 
            :questions="sortedQuestions" 
            @mark-answered="markAsAnswered" 
            @delete="deleteQuestion" 
        />
    </BaseLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AdminQuestionsList from '@/components/questions/AdminQuestionsList.vue';
import { updateQuestion } from '@/api/admin';

export default defineComponent({
    name: 'AdminQuestionsView',
    components: {
        AdminQuestionsList
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const presentationId = route.params.id as string;
        let refreshInterval: NodeJS.Timeout | undefined;

        const sortedQuestions = computed(() => {
            const questions = store.getters['questions/getQuestions'](presentationId);
            return [...questions].sort((a, b) => b.likes - a.likes);
        });

        const refreshQuestions = async () => {
            try {
                await store.dispatch('questions/fetchQuestions', presentationId);
            } catch (error) {
                console.error('Failed to refresh questions:', error);
            }
        };

        const startAutoRefresh = () => {
            refreshInterval = setInterval(refreshQuestions, 5000);
        };

        const markAsAnswered = async (id: string) => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;
                
                if (!adminPassword) {
                    throw new Error('Admin password not found');
                }

                await updateQuestion(id, { state: 'ANSWERED' }, adminPassword);
                await refreshQuestions();
            } catch (error) {
                console.error('Failed to mark question as answered:', error);
            }
        };

        const deleteQuestion = async (id: string) => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;
                
                if (!adminPassword) {
                    throw new Error('Admin password not found');
                }

                await store.dispatch('questions/deleteQuestion', { 
                    questionId: id, 
                    authorToken: adminPassword 
                });
                await refreshQuestions();
            } catch (error) {
                console.error('Failed to delete question:', error);
            }
        };

        const handlePullToRefresh = async (event: any) => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
            await refreshQuestions();
            startAutoRefresh();
            event.detail.complete();
        };

        onMounted(async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                await refreshQuestions();
                startAutoRefresh();
            } catch (error) {
                console.error('Failed to load questions:', error);
            }
        });

        return {
            sortedQuestions,
            markAsAnswered,
            deleteQuestion,
            handlePullToRefresh
        };
    }
});
</script>

<style scoped>
ion-content {
    --background: var(--ion-color-light);
}

ion-item {
    --background: var(--ion-color-light);
}
</style> 