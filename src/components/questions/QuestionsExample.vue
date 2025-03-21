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
                            likes: 0, // Default to 0 likes if not already present
                        }));
                    }
                }
            },
            { deep: true, immediate: true }
        );

        onNewQuestion((newQuestion) => {
            console.log('New question', newQuestion);
            if (newQuestion.presentationId == presentationId.value) {
                questions.value.push({
                    ...newQuestion,
                    likes: 0,
                });
            }
        });

        onMounted(async () => {
            const fetchedQuestions = await requestQuestions(presentationId.value);
            questions.value = fetchedQuestions.map((q) => ({
                ...q,
                likes: q.likes || 0, // Default to 0 likes if not already present
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

        const likeQuestion = async (id) => {
            await likeQuestion(id);
            // The likes count will be updated through the onNewQuestion handler
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
