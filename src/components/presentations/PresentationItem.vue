<template>
    <ion-item @click="toggleStar">
        <ion-icon :name="presentation.starred ? 'star' : 'star-outline'" slot="start" />
        <ion-button v-if="presentation.questionsRoom" slot="end" :router-link="'/questions/' + presentation.id" size="large">
            <ion-icon name="chatbubbles-outline"></ion-icon>
        </ion-button>
        <ion-label>
            <h2>{{ presentation.title }}</h2>
            <p>Prezentující: {{ presentation.presenter }}</p>
            <p>Začátek: {{ new Date(presentation.start).toLocaleTimeString() }}</p>
            <p>Konec: {{ new Date(presentation.end).toLocaleTimeString() }}</p>
        </ion-label>
    </ion-item>
</template>

<script>
import QuestionsIconButton from '../questions/QuestionsIconButton.vue';

export default {
    props: {
        presentation: {
            type: Object,
            required: true
        }
    },
    methods: {
        toggleStar() {
            this.presentation.starred = !this.presentation.starred;
        }
    }
}
</script>