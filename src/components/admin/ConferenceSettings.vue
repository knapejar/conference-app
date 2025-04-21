<template>
    <ion-card class="card-item">
        <ion-card-header>
            <ion-card-title>Conference Settings</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-item>
                <ion-label position="stacked">Name</ion-label>
                <ion-input v-model="conference.name" :disabled="loading"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Description</ion-label>
                <ion-textarea v-model="conference.description" :disabled="loading"></ion-textarea>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Welcome Image</ion-label>
                <div class="image-container">
                    <img v-if="conference.welcomeImageUrl" :src="conference.welcomeImageUrl" alt="Welcome Image" class="preview-image" />
                    <input type="file" @change="handleImageUpload" :disabled="loading" accept="image/*" />
                </div>
            </ion-item>
            <ion-button expand="full" @click="updateConference" :disabled="loading">
                <ion-spinner v-if="loading" name="dots"></ion-spinner>
                <span v-else>Update Conference</span>
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getConference, updateConference as updateConferenceApi } from '@/api/admin'


const conference = reactive({
    name: "",
    description: "",
    welcomeImage: null,
    welcomeImageUrl: ""
})

const loading = ref(false)

const fetchConference = async () => {
    try {
        const data = await getConference()
        if (data) {
            conference.name = data.name || ""
            conference.description = data.description || ""
            conference.welcomeImageUrl = data.welcomeImageUrl || ""
        }
    } catch (error) {
        console.error('Error fetching conference:', error)
    }
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        conference.welcomeImage = file
        // Create a preview URL for the selected image
        conference.welcomeImageUrl = URL.createObjectURL(file)
    }
}

const updateConference = async () => {
    loading.value = true
    try {
        const response = await updateConferenceApi({
            name: conference.name,
            description: conference.description,
            welcomeImage: conference.welcomeImage
        })

        if (response) {
            console.log("Conference updated", response)
            // Update local state with response data
            conference.name = response.name || conference.name
            conference.description = response.description || conference.description
            conference.welcomeImageUrl = response.welcomeImageUrl || conference.welcomeImageUrl
            // Clear the file input
            conference.welcomeImage = null
        }
    } catch (error) {
        console.error('Error updating conference:', error)
        showToast('Error updating conference settings', 'danger')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchConference()
})
</script>

<style scoped>
.card-item {
    height: 100%;
}

.image-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid var(--ion-color-medium);
}
</style> 