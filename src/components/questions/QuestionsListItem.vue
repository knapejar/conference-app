<template>
    <ion-item>
        <ion-badge>{{ question.likes }}</ion-badge>
        <div style="width: 16px;"></div>
        <ion-label>
            <h2>{{ question.author.name }}</h2>
            <p>{{ question.content }}</p>
        </ion-label>
        <ion-button @click="likeQuestion" fill="clear" slot="end">
            <ion-icon name="thumbs-up" style="font-size: 24px;"></ion-icon>
        </ion-button>
    </ion-item>
</template>

<script>
import { likeQuestion } from '@/api';
export default {
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    methods: {
        likeQuestion() {
            likeQuestion(this.question.id);
        }
    }
}
</script>