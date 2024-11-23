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
            messages: [
                { id: 1, user: 'Petr Novák', text: 'Kdy začíná přednáška?', likes: 0 },
                { id: 2, user: 'Daniela Svobodová', text: 'Co bude na oběd?', likes: 0 }
            ],
            nextId: 3
        };
    },
    computed: {
        sortedMessages() {
            return this.messages.slice().sort((a, b) => b.likes - a.likes);
        }
    },
    methods: {
        sendQuestion(newQuestion) {
            this.messages.push({ id: this.nextId++, user: 'Já', text: newQuestion, likes: 0 });
        },
        likeMessage(id) {
            const message = this.messages.find(message => message.id === id);
            if (message) {
                message.likes++;
            }
        }
    }
};
</script>