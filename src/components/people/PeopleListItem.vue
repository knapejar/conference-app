<template>
    <ion-item @click="$emit('openModal', person)">
        <ion-avatar slot="start">
            <img :src="person.imageURL" alt="Profile image" />
        </ion-avatar>
        <ion-label>
            <h2>{{ person.name }}</h2>
            <p>{{ person.role }}</p>
        </ion-label>
        <ion-button slot="end" fill="clear" :router-link="'/questions/' + person.name" @click.stop>
            <ion-icon name="chatbubbles-outline"></ion-icon>
        </ion-button>
    </ion-item>
</template>

<script>
export default {
    name: 'PeopleListItem',
    props: {
        person: {
            type: Object,
            required: true
        }
    }
};
</script>

<style scoped>
/* No custom styles needed */
</style>