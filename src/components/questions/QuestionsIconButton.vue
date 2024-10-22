<template>
    <ion-button slot="end" fill="clear" :router-link="'/questions/' + questionsRoom" @click.stop>
        <ion-icon name="chatbubbles-outline"></ion-icon>
    </ion-button>
</template>

<script>
export default {
    props: {
        questionsRoom: {
            type: String,
            required: true
        }
    }
}
</script>