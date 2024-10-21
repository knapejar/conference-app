<template>
    <ion-item>
        <ion-icon :name="presentation.starred ? 'star' : 'star-outline'" slot="start" @click="toggleStar" />
        <ion-button v-if="presentation.questionsLink" slot="end" :router-link="'/questions/' + presentation.questionsLink" size="large">
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