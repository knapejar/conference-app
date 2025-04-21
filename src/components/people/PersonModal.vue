<template>
    <ion-content v-if="person">
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal">
                        <ion-icon name="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title>{{ person.name }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <img :src="person.imageURL" alt="Profile image" class="modal-image" />
            <h3>{{ person.name }}</h3>
            <p>{{ person.role }}</p>
            <p>{{ person.details }}</p>
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
