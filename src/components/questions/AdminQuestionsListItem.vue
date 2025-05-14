<template>
    <ion-item>
        <ion-badge>{{ question.likes }}</ion-badge>
        <div style="width: 16px;"></div>
        <ion-label>
            <h2>{{ question.content }}</h2>
            <p>{{ question.author }}</p>
        </ion-label>
        <ion-button @click="markAsAnswered" fill="clear" slot="end">
            <ion-icon
                name="checkmark-circle-outline"
                :style="{ fontSize: '24px', color: 'green' }">
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
        markAsAnswered() {
            this.$emit('mark-answered', this.question.id);
        },
        deleteQuestion() {
            this.$emit('delete', this.question.id);
        }
    }
}
</script> 