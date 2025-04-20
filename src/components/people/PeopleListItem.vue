<template>
    <ion-item @click="$emit('openModal', person)">
        <ion-avatar slot="start">
            <img :src="person.imageURL" alt="Profile image" />
        </ion-avatar>
        <ion-label>
            <h2>{{ person.name }}</h2>
            <p>{{ person.role }}</p>
        </ion-label>
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