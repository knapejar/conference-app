<template>
    <BaseLayout :pageTitle="'Otázky ' + $route.params.id">
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
import { computed, onMounted, watch } from 'vue';
// @ts-ignore
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();
        const presentationId = route.params.id;

        // Watch store blocks to update questions if needed
        watch(
            () => store.state.blocks,
            (blocks) => {
                if (blocks && blocks.length) {
                    const presentation = blocks
                        .flatMap((block) => block.presentations)
                        .find((presentation) => presentation.id === presentationId);
                    if (presentation && presentation.questions) {
                        store.commit('questions/setQuestions', presentation.questions);
                    }
                }
            },
            { deep: true, immediate: true }
        );

        // Fetch questions on component mount
        onMounted(async () => {
            await refreshQuestions();
        });

        const refreshQuestions = async () => {
            try {
                await store.dispatch('questions/fetchQuestions', presentationId);
            } catch (error) {
                console.error('Failed to refresh questions:', error);
            }
        };

        const sortedQuestions = computed(() => {
            const questions = store.getters['questions/getQuestions'];
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
            const question = store.getters['questions/getQuestions'].find(q => q.id === id);
            if (question && question.owned) {
                try {
                    await store.dispatch('questions/deleteQuestion', id);
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
        };
    },
};
</script>
