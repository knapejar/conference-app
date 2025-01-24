<template>
    <ion-list>
        <QuestionsListItem v-for="question in questions" :key="question.id" :question="question"
            @like="likeQuestion(question.id)" />
    </ion-list>
</template>

<script>
export default {
    props: {
        questions: {
            type: Array,
            required: true
        }
    },
    methods: {
        likeQuestion(id) {
            this.$emit('like', id);
        }
    }
};
</script>
