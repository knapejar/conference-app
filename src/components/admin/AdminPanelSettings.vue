<template>
    <div class="card-grid">
        <ConferenceSettings />

        <!--
        <ion-card class="card-item">
            <ion-card-header>
                <ion-card-title>Statistics</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-item>
                    <ion-label>Devices Count: {{ stats.devicesCount }}</ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>Users Count: {{ stats.usersCount }}</ion-label>
                </ion-item>
            </ion-card-content>
        </ion-card>

        <ion-card class="card-item">
            <ion-card-header>
                <ion-card-title>Send Notification</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-item>
                    <ion-label position="stacked">Title</ion-label>
                    <ion-input v-model="newNotification.title"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Message</ion-label>
                    <ion-textarea v-model="newNotification.message"></ion-textarea>
                </ion-item>
                <ion-button expand="full" @click="sendNotification">Send Notification</ion-button>
            </ion-card-content>
        </ion-card>
        -->
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import ConferenceSettings from './ConferenceSettings.vue'

const stats = reactive({
    devicesCount: 10,
    usersCount: 20
})

const newNotification = reactive({
    title: "Default Title",
    message: "Default Message"
})

const sendNotification = () => {
    console.log("Notification sent with:", newNotification)
    // API integration will go here later.
}
</script>

<style scoped>
.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
}

@media (min-width: 768px) {
    .card-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    /* Make the notification card span the full width in the second row */
    .card-grid ion-card:nth-child(3) {
        grid-column: 1 / -1;
    }
}
</style>