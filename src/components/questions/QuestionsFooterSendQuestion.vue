<template>
    <ion-toolbar>
            <ion-item>
                    <ion-input v-model="question" placeholder="Váš dotaz" @keyup.enter="sendNewQuestion"></ion-input>
                    <ion-button @click="sendNewQuestion">Odeslat</ion-button>
            </ion-item>
    </ion-toolbar>
</template>

<script>
export default {
    data() {
            return {
                    question: ''
            };
    },
    methods: {
            sendNewQuestion() {
                    if (this.question.trim() !== '') {
                            this.$emit('send', this.question);
                            this.question = '';
                    }
            }
    }
};
</script>
