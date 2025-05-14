<template>
    <ion-list>
        <AdminQuestionsListItem v-for="question in questions" :key="question.id" :question="question"
            @mark-answered="markAsAnswered" @delete="deleteQuestion" />
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
        markAsAnswered(id) {
            this.$emit('mark-answered', id);
        },
        deleteQuestion(id) {
            this.$emit('delete', id);
        }
    }
};
</script> 