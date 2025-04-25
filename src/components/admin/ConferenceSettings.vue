<template>
    <ion-card class="card-item">
        <ion-card-header>
            <ion-card-title>Nastavení konference</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-item>
                <ion-label position="stacked">Název</ion-label>
                <ion-input v-model="conference.name"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Popis</ion-label>
                <ion-textarea v-model="conference.description"></ion-textarea>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Uvítací obrázek</ion-label>
                <div class="image-container">
                    <img v-if="conference.welcomeImageUrl" :src="conference.welcomeImageUrl" alt="Welcome Image" class="preview-image" />
                    <input type="file" @change="handleImageUpload" accept="image/*" />
                </div>
            </ion-item>
            <ion-button expand="full" @click="updateConference">
                Uložit
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { getConference, updateConference as updateConferenceApi } from '@/api/admin'
import { toastController } from '@ionic/vue'
import { useStore } from 'vuex'

const store = useStore()
const adminPassword = computed(() => store.state.admin.password)

const showToast = async (message, color = 'success') => {
    const toast = await toastController.create({
        message,
        duration: 3000,
        color,
        position: 'top'
    })
    await toast.present()
}

const conference = reactive({
    name: "",
    description: "",
    welcomeImage: null,
    welcomeImageUrl: ""
})

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
        showToast('Chyba při načítání nastavení konference', 'danger')
    }
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        conference.welcomeImage = file
        conference.welcomeImageUrl = URL.createObjectURL(file)
    }
}

const updateConference = async () => {
    try {
        const response = await updateConferenceApi({
            name: conference.name,
            description: conference.description,
            welcomeImage: conference.welcomeImage
        }, adminPassword.value)

        if (response) {
            conference.name = response.name || conference.name
            conference.description = response.description || conference.description
            conference.welcomeImageUrl = response.welcomeImageUrl || conference.welcomeImageUrl
            conference.welcomeImage = null
            showToast('Nastavení konference aktualizováno')
        }
    } catch (error) {
        console.error('Error updating conference:', error)
        showToast('Chyba při aktualizaci nastavení konference', 'danger')
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