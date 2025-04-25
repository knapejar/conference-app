<template>
    <BaseLayout :page-title="isNew ? 'Nový konferenční blok' : 'Upravit konferenční blok'">
        <ion-list>
            <ion-item>
                <ion-label position="stacked">Název konferenčního bloku</ion-label>
                <ion-input v-model="blockData.blockName" placeholder="Enter block name"></ion-input>
            </ion-item>

            <BlockDateSelector
                v-model="blockData.start"
                label="Původní začátek"
                :min-date="minDate"
                :max-date="maxDate"
            />

            <BlockDateSelector
                v-model="blockData.end"
                label="Původní konec"
                :min-date="blockData.start"
                :max-date="maxDate"
            />
        </ion-list>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="saveBlock">
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
import { updateBlock, createBlock } from '@/api/admin';
import BlockDateSelector from './BlockDateSelector.vue';

interface BlockData {
    id?: string;
    blockName: string;
    start: string;
    end: string;
}

export default defineComponent({
    name: 'ConferenceBlockEditor',
    components: {
        BlockDateSelector
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const blockId = route.params.id as string;
        const isNew = !blockId;

        const blockData = ref<BlockData>({
            blockName: '',
            start: new Date().toISOString().split('.')[0],
            end: new Date().toISOString().split('.')[0]
        });

        const formatBlockTime = (block: BlockData): string => {
            return `${new Date(block.start).toLocaleTimeString()} - ${new Date(block.end).toLocaleTimeString()}`;
        };

        const minDate = computed(() => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 2); // Allow dates from one year ago
            return date.toISOString().split('.')[0];
        });

        const maxDate = computed(() => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 2); // Allow dates up to one year from now
            return date.toISOString().split('.')[0];
        });

        const loadBlock = async () => {
            if (!isNew) {
                await store.dispatch('presentations/fetchPresentations');
                
                const blocks = store.getters['presentations/getBlocks'];
                const block = blocks.find((b: any) => String(b.id) === String(blockId));
                
                if (block) {
                    blockData.value = {
                        id: block.id,
                        blockName: block.blockName,
                        start: block.start,
                        end: block.end
                    };
                } else {
                    console.error('Block not found:', blockId);
                }
            }
        };

        const saveBlock = async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                
                const adminPassword = store.state.admin.password;
                if (!adminPassword) {
                    throw new Error('Admin password not found. Please log in again.');
                }

                const startDate = new Date(blockData.value.start);
                const endDate = new Date(blockData.value.end);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Invalid date values');
                }

                if (endDate < startDate) {
                    throw new Error('End time must be after start time');
                }

                const data = {
                    blockName: blockData.value.blockName,
                    start: blockData.value.start,
                    end: blockData.value.end
                };

                if (isNew) {
                    await createBlock(data, adminPassword);
                } else {
                    await updateBlock(blockId, data, adminPassword);
                }

                await store.dispatch('presentations/fetchPresentations');
                router.push('/admin?tab=blocks');
            } catch (error: any) {
                console.error('Failed to save block:', error);
                if (error.message?.includes('password') || error.message?.includes('authentication')) {
                    router.push('/admin');
                }
            }
        };

        onMounted(async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                await loadBlock();
            } catch (error: any) {
                console.error('Authentication error:', error);
                router.push('/admin');
            }
        });

        return {
            blockData,
            isNew,
            minDate,
            maxDate,
            saveBlock,
            save,
            formatBlockTime
        };
    }
});
</script>

<style scoped>
ion-datetime {
    width: 100%;
}
</style> 