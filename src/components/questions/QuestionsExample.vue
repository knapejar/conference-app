<template>
    <BaseLayout :pageTitle="'Otázky ' + $route.params.id">
        <QuestionsList :questions="sortedQuestions" @like="likeQuestion" />
        <template v-slot:footer>
            <QuestionsFooterSendQuestion @send="sendQuestion" />
        </template>
    </BaseLayout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { requestQuestions, postQuestion, onNewQuestion } from '@/api';
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();
        const questions = ref([]);
        const presentationId = ref(route.params.id);

        watch(
            () => store.state.blocks,
            (blocks) => {
                console.log('Blocks changed', blocks);
                console.log('Presentation ID', presentationId.value);
                console.log('Questions', questions.value);
                if (blocks && blocks.length) {
                    const presentation = blocks
                        .flatMap((block) => block.presentations)
                        .find((presentation) => presentation.id === presentationId.value);
                    if (presentation && presentation.questions) {
                        questions.value = presentation.questions.map((q) => ({
                            ...q,
                        }));
                    }
                }
            },
            { deep: true, immediate: true }
        );

        onNewQuestion((newQuestion) => {
            console.log('New question', newQuestion);
            if (newQuestion.presentationId == presentationId.value) {
            const existingQuestionIndex = questions.value.findIndex(q => q.id === newQuestion.id);
            if (existingQuestionIndex !== -1) {
                // Update existing question
                questions.value[existingQuestionIndex] = {
                ...questions.value[existingQuestionIndex],
                ...newQuestion
                };
            } else {
                // Add new question
                questions.value.push({
                ...newQuestion,
                });
            }
            }
        });

        onMounted(async () => {
            const fetchedQuestions = await requestQuestions(presentationId.value);
            questions.value = fetchedQuestions.map((q) => ({
                ...q,
                likes: q.likes,
            }));
        });

        const sortedQuestions = computed(() => {
            return [...questions.value].sort((a, b) => b.likes - a.likes);
        });

        const sendQuestion = async (newQuestion) => {
            await postQuestion({
                content: newQuestion,
                presentationId: presentationId.value,
                token: store.state.deviceToken,
            });
        };

        const likeQuestion = (id) => {
            const question = questions.value.find((question) => question.id === id);
            if (question) {
                question.likes++;
            }
        };

        return {
            questions,
            sortedQuestions,
            sendQuestion,
            likeQuestion,
        };
    },
};
</script>
