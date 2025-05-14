<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Odeslat oznámení</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-item>
                <ion-label position="stacked">Název</ion-label>
                <ion-input v-model="announcement.title" placeholder="Zadejte název oznámení"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Zpráva</ion-label>
                <ion-textarea v-model="announcement.message" placeholder="Zadejte zprávu"></ion-textarea>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Typ</ion-label>
                <ion-select v-model="announcement.type" interface="action-sheet">
                    <ion-select-option value="Welcome">Uvítací</ion-select-option>
                    <ion-select-option value="Important">Důležité</ion-select-option>
                    <ion-select-option value="Info">Informace</ion-select-option>
                </ion-select>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Kategorie</ion-label>
                <ion-select v-model="announcement.category" interface="action-sheet">
                    <ion-select-option value="General">Obecné</ion-select-option>
                    <ion-select-option value="Program">Program</ion-select-option>
                    <ion-select-option value="Technical">Technické</ion-select-option>
                </ion-select>
            </ion-item>

            <ion-button expand="block" @click="sendAnnouncement" :disabled="!isValid">
                <ion-icon :icon="send" slot="start"></ion-icon>
                Odeslat
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { send } from 'ionicons/icons';
import { createAnnouncement } from '@/api/admin';

interface Announcement {
    title: string;
    message: string;
    type: 'Welcome' | 'Important' | 'Info';
    category: 'General' | 'Program' | 'Technical';
}

export default defineComponent({
    name: 'AnnouncementSender',
    setup() {
        const store = useStore();

        const announcement = reactive<Announcement>({
            title: '',
            message: '',
            type: 'Info',
            category: 'General'
        });

        const isValid = computed(() => {
            return announcement.title.trim() !== '' && announcement.message.trim() !== '';
        });

        const sendAnnouncement = async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;
                
                if (!adminPassword) {
                    throw new Error('Admin password not found');
                }

                await createAnnouncement({
                    title: announcement.title,
                    message: announcement.message,
                    type: announcement.type,
                    category: announcement.category,
                    date: new Date().toISOString()
                }, adminPassword);

                // Reset form
                announcement.title = '';
                announcement.message = '';
                announcement.type = 'Info';
                announcement.category = 'General';
            } catch (error) {
                console.error('Failed to send announcement:', error);
            }
        };

        return {
            announcement,
            isValid,
            sendAnnouncement,
            send
        };
    }
});
</script>