<template>
    <ion-list>
        <ion-item-group v-for="block in blocks" :key="block.id">
            <ion-item-divider sticky>
                <ion-label>
                    <h2>{{ block.blockName }}</h2>
                    <p>{{ formatBlockTime(block) }}</p>
                    <div>
                        <ion-button slot="end" fill="clear" @click="addNewPresentation(block)">
                            <ion-icon icon="add" />
                        </ion-button>
                        <ion-button slot="end" fill="clear" @click="editBlock(block)">
                            <ion-icon icon="pencil" />
                        </ion-button>
                        <ion-button slot="end" fill="clear" color="danger" @click="handleDeleteBlock(block)">
                            <ion-icon icon="trash" />
                        </ion-button>
                    </div>
                </ion-label>
            </ion-item-divider>

            <ion-item v-for="presentation in block.presentations" :key="presentation.id">
                <ion-label>
                    <h3>{{ presentation.title }}</h3>
                    <p>{{ formatPresentationTime(presentation) }}</p>
                </ion-label>
                <ion-button slot="end" fill="clear" @click="editPresentation(presentation)">
                    <ion-icon icon="pencil" />
                </ion-button>
                <ion-button slot="end" fill="clear" color="danger" @click="handleDeletePresentation(presentation)">
                    <ion-icon icon="trash" />
                </ion-button>
            </ion-item>
        </ion-item-group>
    </ion-list>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addNewBlock">
            <ion-icon icon="add" />
        </ion-fab-button>
    </ion-fab>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { deleteBlock as apiDeleteBlock, deletePresentation as apiDeletePresentation } from '@/api/admin';

interface Presentation {
    id: string;
    title: string;
    speaker: string;
    start: string;
    end: string;
}

interface Block {
    id: string;
    blockName: string;
    start: string;
    end: string;
    presentations: Presentation[];
}

export default defineComponent({
    name: 'ConferenceBlocksManager',
    setup() {
        const store = useStore();
        const router = useRouter();

        const blocks = computed(() => store.getters['presentations/getBlocks']);
        const isLoading = computed(() => store.getters['presentations/isLoading']);
        const error = computed(() => store.getters['presentations/getError']);

        const loadBlocks = async () => {
            try {
                await store.dispatch('presentations/fetchPresentations');
            } catch (error) {
                console.error('Failed to load blocks:', error);
            }
        };

        const formatBlockTime = (block: Block): string => {
            return `${new Date(block.start).toLocaleTimeString()} - ${new Date(block.end).toLocaleTimeString()}`;
        };

        const formatPresentationTime = (presentation: Presentation): string => {
            return `${new Date(presentation.start).toLocaleTimeString()} - ${new Date(presentation.end).toLocaleTimeString()}`;
        };

        const editBlock = (block: Block): void => {
            router.push(`/admin/blocks/${block.id}`);
        };

        const editPresentation = (presentation: Presentation): void => {
            router.push(`/admin/presentations/${presentation.id}`);
        };

        const addNewBlock = (): void => {
            router.push('/admin/blocks/new');
        };

        const addNewPresentation = (block: Block): void => {
            router.push(`/admin/presentations/new?blockId=${block.id}`);
        };

        const handleDeleteBlock = async (block: Block): Promise<void> => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;

                if (!adminPassword) {
                    throw new Error('Admin password not found. Please log in again.');
                }

                await apiDeleteBlock(String(block.id), adminPassword);
                const updatedBlocks = blocks.value.filter((b: Block) => b.id !== block.id);
                store.commit('presentations/setBlocks', updatedBlocks);
            } catch (error: any) {
                console.error('Failed to delete block:', error);
                if (error.message?.includes('password') || error.message?.includes('authentication')) {
                    router.push('/admin');
                }
            }
        };

        const handleDeletePresentation = async (presentation: Presentation): Promise<void> => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;

                if (!adminPassword) {
                    throw new Error('Admin password not found. Please log in again.');
                }

                await apiDeletePresentation(String(presentation.id), adminPassword);
                const updatedBlocks = blocks.value.map((block: Block) => {
                    if (block.presentations.some((p: Presentation) => p.id === presentation.id)) {
                        return {
                            ...block,
                            presentations: block.presentations.filter((p: Presentation) => p.id !== presentation.id)
                        };
                    }
                    return block;
                });
                store.commit('presentations/setBlocks', updatedBlocks);
            } catch (error: any) {
                console.error('Failed to delete presentation:', error);
                if (error.message?.includes('password') || error.message?.includes('authentication')) {
                    router.push('/admin');
                }
            }
        };

        onMounted(() => {
            loadBlocks();
        });

        return {
            blocks,
            isLoading,
            error,
            formatBlockTime,
            formatPresentationTime,
            editBlock,
            editPresentation,
            addNewBlock,
            addNewPresentation,
            handleDeleteBlock,
            handleDeletePresentation
        };
    }
});
</script>

<style scoped>
ion-content {
    --background: var(--ion-color-light);
}

ion-item-divider {
    --background: var(--ion-color-light-shade);
}

ion-item {
    --padding-start: 16px;
    --padding-end: 16px;
}
</style>