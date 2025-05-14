<template>
    <ion-item>
        <ion-badge>{{ question.likes }}</ion-badge>
        <div style="width: 16px;"></div>
        <ion-label>
            <h2>{{ question.content }}</h2>
            <p>{{ question.author }}</p>
        </ion-label>
        <ion-button v-if="question.owned" @click="deleteQuestion" fill="clear" slot="end">
            <ion-icon
                name="trash"
                :style="{ fontSize: '24px', color: 'red' }">
            </ion-icon>
        </ion-button>
        <ion-button @click="likeQuestion" fill="clear" slot="end">
            <ion-icon
                name="thumbs-up"
                :style="{ fontSize: '24px', color: question.isLiked ? 'blue' : 'gray' }">
            </ion-icon>
        </ion-button>
    </ion-item>
</template>

<script>
export default {
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    methods: {
        likeQuestion() {
            this.$emit('like', this.question.id);
        },
        deleteQuestion() {
            this.$emit('delete', this.question.id);
        }
    }
}
</script>