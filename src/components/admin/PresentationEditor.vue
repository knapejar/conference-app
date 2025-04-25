<template>
    <BaseLayout :page-title="isNew ? 'Nová prezentace' : 'Upravit prezentaci'">
        <ion-list>
            <ion-item>
                <ion-label>
                    <h2>Konferenční blok</h2>
                    <p>{{ currentBlock?.blockName || 'Načítání...' }}</p>
                </ion-label>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Název prezentace</ion-label>
                <ion-input v-model="presentationData.title" placeholder="Zadejte název prezentace"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Popis</ion-label>
                <ion-textarea v-model="presentationData.description" placeholder="Zadejte popis prezentace"></ion-textarea>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Prezentéři</ion-label>
                <ion-select
                    v-model="presentationData.presenterIds"
                    multiple
                    :interface-options="{
                        header: 'Vyberte prezentéry',
                        subHeader: 'Můžete vybrat více prezentérů'
                    }"
                    interface="action-sheet"
                >
                    <ion-select-option v-for="presenter in presenters" :key="presenter.id" :value="String(presenter.id)">
                        {{ presenter.name }} ({{ presenter.role }})
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
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
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
    questionsRoom: boolean;
    presenterIds: string[];
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
        let blockId = route.query.blockId as string;

        const presentationData = ref<PresentationData>({
            title: '',
            description: '',
            start: new Date().toISOString().split('.')[0],
            end: new Date().toISOString().split('.')[0],
            questionsRoom: false,
            presenterIds: []
        });

        const blocks = computed(() => store.getters['presentations/getBlocks']);
        const presenters = computed(() => store.getters['people/getPeople']);

        const currentBlock = computed(() => {
            if (!blockId) return null;
            return blocks.value.find((b: any) => String(b.id) === blockId);
        });

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
            // Always load blocks and presenters first
            await store.dispatch('presentations/fetchPresentations');
            await store.dispatch('people/fetchPeople');
            
            if (!isNew) {
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
                            questionsRoom: presentation.questionsRoom,
                            presenterIds: presentation.presenters.map((p: any) => String(p.id))
                        };
                        // Set blockId from the presentation's block
                        blockId = String(block.id);
                        break;
                    }
                }
                
                if (!presentation) {
                    console.error('Presentation not found:', presentationId);
                }
            } else if (blockId) {
                // For new presentations, pre-fill with block's data
                const block = blocks.value.find((b: any) => String(b.id) === blockId);
                if (block) {
                    presentationData.value = {
                        ...presentationData.value,
                        start: block.start,
                        end: block.end
                    };
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

                if (!blockId) {
                    throw new Error('Block ID is required');
                }

                const startDate = new Date(presentationData.value.start);
                const endDate = new Date(presentationData.value.end);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Invalid date values');
                }

                if (endDate < startDate) {
                    throw new Error('End time must be after start time');
                }

                const data = {
                    title: presentationData.value.title,
                    description: presentationData.value.description,
                    start: presentationData.value.start,
                    end: presentationData.value.end,
                    blockId: String(blockId),
                    questionsRoom: presentationData.value.questionsRoom,
                    presenterIds: presentationData.value.presenterIds
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
            presenters,
            isNew,
            minDate,
            maxDate,
            savePresentation,
            save,
            currentBlock
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