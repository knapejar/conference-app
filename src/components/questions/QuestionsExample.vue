<template>
    <BaseLayout :pageTitle="'Otázky ' + $route.params.id">
        <QuestionsList :messages="sortedMessages" @like="likeMessage" />
        <template v-slot:footer>
            <QuestionsFooterSendQuestion @send="sendQuestion" />
        </template>
    </BaseLayout>
</template>

<script>
import { fetchQuestions, postQuestion, onNewQuestion } from '@/api';

export default {
    data() {
        return {
            messages: [],
            nextId: 1, // No longer needed, IDs come from the backend
            presentationId: null, // To track which presentation's questions are being fetched
        };
    },
    computed: {
        sortedMessages() {
            return this.messages.slice().sort((a, b) => b.likes - a.likes);
        }
    },
    methods: {
        async sendQuestion(newQuestion) {
            // Send question to the backend
            const postedQuestion = await postQuestion({
                content: newQuestion,
                presentationId: this.presentationId,
                user: 'Já', // Replace with the actual user later
            });

            // Optimistically add the question locally (already updated via WebSocket)
            this.messages.push({
                id: postedQuestion.id,
                user: postedQuestion.user,
                text: postedQuestion.content,
                likes: 0,
            });
        },
        likeMessage(id) {
            const message = this.messages.find((message) => message.id === id);
            if (message) {
                message.likes++;
            }
        },
    },
    async created() {
        // Extract presentationId from route params
        this.presentationId = parseInt(this.$route.params.id, 10);

        // Fetch initial list of questions
        this.messages = (await fetchQuestions(this.presentationId)).map((question) => ({
            id: question.id,
            user: question.user,
            text: question.content,
            likes: 0, // Add a `likes` property for local use
        }));

        // Listen for real-time updates via WebSocket
        onNewQuestion((newQuestion) => {
            if (newQuestion.presentationId === this.presentationId) {
                this.messages.push({
                    id: newQuestion.id,
                    user: newQuestion.user,
                    text: newQuestion.content,
                    likes: 0,
                });
            }
        });
    },
};
</script>
