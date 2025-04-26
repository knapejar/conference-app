<template>
    <BaseLayout pageTitle="Otázky">
        <ion-refresher slot="fixed" @ionRefresh="handlePullToRefresh">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        
        <QuestionsList 
            :questions="sortedQuestions" 
            @like="likeQuestion" 
            @delete="deleteQuestionHandler" 
        />
        <template v-slot:footer>
            <QuestionsFooterSendQuestion @send="sendQuestion" />
        </template>
    </BaseLayout>
</template>

<script>
import { computed, onMounted, onUnmounted, watch } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();
        const presentationId = route.params.id;
        let refreshInterval;

        const getPresentationFromBlocks = (blocks) => {
            if (!blocks || !blocks.length) return null;
            return blocks
                .flatMap((block) => block.presentations)
                .find((presentation) => presentation.id === presentationId);
        };

        watch(
            () => store.getters['presentations/getBlocks'],
            (blocks) => {
                const presentation = getPresentationFromBlocks(blocks);
                if (presentation && presentation.questions) {
                    store.commit('questions/setQuestions', { 
                        presentationId, 
                        questions: presentation.questions 
                    });
                }
            },
            { deep: true }
        );

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

        onMounted(async () => {
            await refreshQuestions();
            startAutoRefresh();
        });

        onUnmounted(() => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        });

        const sortedQuestions = computed(() => {
            const questions = store.getters['questions/getQuestions'](presentationId);
            return [...questions].sort((a, b) => b.likes - a.likes);
        });

        const sendQuestion = async (newQuestion) => {
            try {
                await store.dispatch('questions/createNewQuestion', {
                    presentationId,
                    question: newQuestion
                });
            } catch (error) {
                console.error('Error sending question:', error);
            }
        };

        const likeQuestion = async (id) => {
            try {
                await store.dispatch('questions/toggleLike', id);
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        };

        const deleteQuestionHandler = async (id) => {
            const questions = store.getters['questions/getQuestions'](presentationId);
            const question = questions.find(q => q.id === id);
            if (question && question.owned) {
                try {
                    const authorToken = store.getters['settings/getAuthorToken'];
                    if (!authorToken) {
                        throw new Error('Author token not initialized');
                    }
                    await store.dispatch('questions/deleteQuestion', { 
                        questionId: id, 
                        authorToken 
                    });
                } catch (error) {
                    console.error('Error deleting question:', error);
                }
            } else {
                console.warn('Deletion is allowed for your own questions only.');
            }
        };

        const handlePullToRefresh = async (event) => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
            await refreshQuestions();
            startAutoRefresh();
            event.detail.complete();
        };

        return {
            sortedQuestions,
            sendQuestion,
            likeQuestion,
            deleteQuestionHandler,
            handlePullToRefresh,
        };
    },
};
</script>
