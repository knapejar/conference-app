<template>
    <ion-content v-if="person">
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal">Close</ion-button>
                </ion-buttons>
                <QuestionsIconButton :questionsRoom="person.name" @click="closeModal"/>
                <ion-title>{{ person.name }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <img :src="person.imageURL" alt="Profile image" class="modal-image" />
            <h3>{{ person.name }}</h3>
            <p>{{ person.role }}</p>
        </ion-content>
    </ion-content>
</template>

<script>
export default {
    name: 'PersonModal',
    props: {
        person: {
            type: Object,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.modal-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin: 20px auto;
    display: block;
}
</style>
