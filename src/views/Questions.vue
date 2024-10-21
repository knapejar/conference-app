<template>
    <BaseLayout :pageTitle="'Otázky ' + $route.params.id">
        <ion-list>
            <ion-item v-for="message in sortedMessages" :key="message.id">
                <ion-badge>{{ message.likes }}</ion-badge>
                <div style="width: 16px;"></div>
                <ion-label>
                    <h2>{{ message.user }}</h2>
                    <p>{{ message.text }}</p>
                </ion-label>
                <ion-button @click="likeMessage(message.id)" fill="clear" slot="end">
                    <ion-icon name="thumbs-up" style="font-size: 24px;"></ion-icon>
                </ion-button>
            </ion-item>
        </ion-list>
        <template v-slot:footer>
            <ion-toolbar>
                <ion-item>
                    <ion-input v-model="newQuestion" placeholder="Váš dotaz"></ion-input>
                    <ion-button @click="sendQuestion">Odeslat</ion-button>
                </ion-item>
            </ion-toolbar>
        </template>
    </BaseLayout>
</template>

<script>
export default {
    data() {
        return {
            messages: [
                { id: 1, user: 'Petr Novák', text: 'Kdy začíná přednáška?', likes: 0 },
                { id: 2, user: 'Daniela Svobodová', text: 'Co bude na oběd?', likes: 0 }
            ],
            newQuestion: '',
            nextId: 3
        };
    },
    computed: {
        sortedMessages() {
            return this.messages.slice().sort((a, b) => b.likes - a.likes);
        }
    },
    methods: {
        sendQuestion() {
            if (this.newQuestion.trim() !== '') {
                this.messages.push({ id: this.nextId++, user: 'Já', text: this.newQuestion, likes: 0 });
                this.newQuestion = '';
            }
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