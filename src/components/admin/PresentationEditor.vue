<template>
    <BaseLayout :page-title="isNew ? 'Nová prezentace' : 'Upravit prezentaci'">
        <ion-list>
            <ion-item>
                <ion-label position="stacked">Název prezentace</ion-label>
                <ion-input v-model="presentationData.title" placeholder="Zadejte název prezentace"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Popis</ion-label>
                <ion-textarea v-model="presentationData.description" placeholder="Zadejte popis prezentace"></ion-textarea>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Konferenční blok</ion-label>
                <ion-select v-model="presentationData.blockId" placeholder="Vyberte konferenční blok">
                    <ion-select-option v-for="block in blocks" :key="block.id" :value="block.id">
                        {{ block.blockName }}
                    </ion-select-option>
                </ion-select>
            </ion-item>

            <BlockDateSelector
                v-model="presentationData.start"
                label="Začátek prezentace"
                :min-date="minDate"
                :max-date="maxDate"
            />

            <BlockDateSelector
                v-model="presentationData.end"
                label="Konec prezentace"
                :min-date="presentationData.start"
                :max-date="maxDate"
            />

            <ion-item>
                <ion-label>Místnost pro otázky</ion-label>
                <ion-toggle v-model="presentationData.questionsRoom"></ion-toggle>
            </ion-item>
        </ion-list>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="savePresentation">
                <ion-icon :icon="save"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </BaseLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { save } from 'ionicons/icons';
import { updatePresentation, createPresentation } from '@/api/admin';
import BlockDateSelector from './BlockDateSelector.vue';

interface PresentationData {
    id?: string;
    title: string;
    description: string;
    start: string;
    end: string;
    blockId: string;
    questionsRoom: boolean;
}

export default defineComponent({
    name: 'PresentationEditor',
    components: {
        BlockDateSelector
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const presentationId = route.params.id as string;
        const isNew = !presentationId;

        const presentationData = ref<PresentationData>({
            title: '',
            description: '',
            start: new Date().toISOString().split('.')[0],
            end: new Date().toISOString().split('.')[0],
            blockId: '',
            questionsRoom: false
        });

        const blocks = computed(() => store.getters['presentations/getBlocks']);

        const minDate = computed(() => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 2);
            return date.toISOString().split('.')[0];
        });

        const maxDate = computed(() => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 2);
            return date.toISOString().split('.')[0];
        });

        const loadPresentation = async () => {
            if (!isNew) {
                await store.dispatch('presentations/fetchPresentations');
                
                const blocks = store.getters['presentations/getBlocks'];
                let presentation = null;
                
                // Find the presentation in any block
                for (const block of blocks) {
                    presentation = block.presentations.find((p: any) => String(p.id) === String(presentationId));
                    if (presentation) {
                        presentationData.value = {
                            id: presentation.id,
                            title: presentation.title,
                            description: presentation.description,
                            start: presentation.start,
                            end: presentation.end,
                            blockId: String(presentation.blockId),
                            questionsRoom: presentation.questionsRoom
                        };
                        break;
                    }
                }
                
                if (!presentation) {
                    console.error('Presentation not found:', presentationId);
                }
            }
        };

        const savePresentation = async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                
                const adminPassword = store.state.admin.password;
                if (!adminPassword) {
                    throw new Error('Admin password not found. Please log in again.');
                }

                const startDate = new Date(presentationData.value.start);
                const endDate = new Date(presentationData.value.end);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Invalid date values');
                }

                if (endDate < startDate) {
                    throw new Error('End time must be after start time');
                }

                if (!presentationData.value.blockId) {
                    throw new Error('Please select a conference block');
                }

                const data = {
                    title: presentationData.value.title,
                    description: presentationData.value.description,
                    start: presentationData.value.start,
                    end: presentationData.value.end,
                    blockId: presentationData.value.blockId,
                    questionsRoom: presentationData.value.questionsRoom
                };

                if (isNew) {
                    await createPresentation(data, adminPassword);
                } else {
                    await updatePresentation(presentationId, data, adminPassword);
                }

                await store.dispatch('presentations/fetchPresentations');
                router.push('/admin?tab=blocks');
            } catch (error: any) {
                console.error('Failed to save presentation:', error);
                if (error.message?.includes('password') || error.message?.includes('authentication')) {
                    router.push('/admin');
                }
            }
        };

        onMounted(async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                await loadPresentation();
            } catch (error: any) {
                console.error('Authentication error:', error);
                router.push('/admin');
            }
        });

        return {
            presentationData,
            blocks,
            isNew,
            minDate,
            maxDate,
            savePresentation,
            save
        };
    }
});
</script>

<style scoped>
ion-content {
    --background: var(--ion-color-light);
}

ion-item {
    --background: var(--ion-color-light);
}
</style> 