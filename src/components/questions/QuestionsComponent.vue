<template>
    <BaseLayout :pageTitle="'Otázky ' + presentationTitle">
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

        const presentationTitle = computed(() => {
            const blocks = store.state.blocks;
            if (blocks && blocks.length) {
                const presentation = blocks
                    .flatMap((block) => block.presentations)
                    .find((presentation) => presentation.id === presentationId);
                console.log('Found presentation:', presentation);
                return presentation ? presentation.title : '';
            }
            return '';
        });

        watch(
            () => store.state.blocks,
            (blocks) => {
                if (blocks && blocks.length) {
                    const presentation = blocks
                        .flatMap((block) => block.presentations)
                        .find((presentation) => presentation.id === presentationId);
                    if (presentation && presentation.questions) {
                        store.commit('questions/setQuestions', { 
                            presentationId, 
                            questions: presentation.questions 
                        });
                    }
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

        // Only fetch questions if we don't have them yet
        onMounted(async () => {
            // Always fetch fresh questions when entering the chatroom
            await refreshQuestions();
            
            // Set up periodic refresh every 5 seconds
            refreshInterval = setInterval(refreshQuestions, 5000);
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
                    const authorToken = await store.dispatch('settings/generateAuthorToken', null, { root: true });
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

        return {
            sortedQuestions,
            sendQuestion,
            likeQuestion,
            deleteQuestionHandler,
            presentationTitle,
        };
    },
};
</script>
