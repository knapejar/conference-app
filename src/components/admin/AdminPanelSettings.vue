<template>
    <div class="card-grid">
        <ConferenceSettings />
        <NotificationSender />
    </div>
</template>

<script setup>
import ConferenceSettings from './ConferenceSettings.vue'
import NotificationSender from './NotificationSender.vue'
</script>

<style scoped>
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    padding: 16px;
}
</style>