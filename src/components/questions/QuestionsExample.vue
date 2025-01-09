<template>
    <BaseLayout :pageTitle="'Otázky ' + $route.params.id">
        <QuestionsList :messages="sortedMessages" @like="likeMessage" />
        <template v-slot:footer>
            <QuestionsFooterSendQuestion @send="sendQuestion" />
        </template>
    </BaseLayout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { postQuestion, onNewQuestion } from '@/api';
import { useStore } from '@/composables/useVuexStore.js';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();
        const messages = ref([]); // Make messages reactive
        const presentationId = ref(route.params.id); // Make presentationId reactive

        // Watch for changes to blocks in the store
        watch(
            () => store.state.blocks,
            (blocks) => {
                console.log('Blocks changed', blocks);
                console.log('Presentation ID', presentationId.value);
                console.log('Messages', messages.value);
                if (blocks && blocks.length) {
                    const presentation = blocks
                        .flatMap((block) => block.presentations)
                        .find((presentation) => presentation.id === presentationId.value);
                    if (presentation && presentation.questions) {
                        messages.value = presentation.questions.map((q) => ({
                            ...q,
                            likes: 0, // Default to 0 likes if not already present
                        }));
                    }
                }
            },
            { deep: true, immediate: true }
        );

        // WebSocket listener for new questions
        onNewQuestion((newQuestion) => {
            if (newQuestion.presentationId === presentationId.value) {
                messages.value.push({
                    id: newQuestion.id,
                    user: newQuestion.user,
                    text: newQuestion.content,
                    likes: 0,
                });
            }
        });

        const sortedMessages = computed(() => {
            return [...messages.value].sort((a, b) => b.likes - a.likes);
        });

        const sendQuestion = async (newQuestion) => {
            const postedQuestion = await postQuestion({
                content: newQuestion,
                presentationId: presentationId.value,
                token: store.state.deviceToken,
            });
            console.log('Posted question', postedQuestion);
        };

        const likeMessage = (id) => {
            const message = messages.value.find((message) => message.id === id);
            if (message) {
                message.likes++;
            }
        };

        return {
            messages,
            sortedMessages,
            sendQuestion,
            likeMessage,
        };
    },
};
</script>
