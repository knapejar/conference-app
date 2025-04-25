<template>
    <ion-content>
        <ion-list>
            <ion-item-group>
                <ion-item-divider sticky>
                    <ion-label>Prezentéři</ion-label>
                    <ion-button slot="end" fill="clear" @click="addNewPresenter">
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                </ion-item-divider>

                <ion-item v-for="presenter in presenters" :key="presenter.id">
                    <ion-avatar slot="start">
                        <img :src="presenter.imageURL" :alt="presenter.name" />
                    </ion-avatar>
                    <ion-label>
                        <h2>{{ presenter.name }}</h2>
                        <p>{{ presenter.role }}</p>
                    </ion-label>
                    <ion-button slot="end" fill="clear" @click="editPresenter(presenter)">
                        <ion-icon :icon="pencil"></ion-icon>
                    </ion-button>
                    <ion-button slot="end" fill="clear" color="danger" @click="deletePresenter(presenter)">
                        <ion-icon :icon="trash"></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-item-group>
        </ion-list>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="addNewPresenter">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </ion-content>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { add, pencil, trash } from 'ionicons/icons';
import { deletePresenter } from '@/api/admin';

interface Presenter {
    id: string;
    name: string;
    role: string;
    imageURL: string;
    details: string;
    presentationId: string;
}

export default defineComponent({
    name: 'PresentersManager',
    setup() {
        const store = useStore();
        const router = useRouter();

        const presenters = computed(() => store.getters['people/getPeople']);
        const isLoading = computed(() => store.getters['people/isLoading']);
        const error = computed(() => store.getters['people/getError']);

        const loadPresenters = async () => {
            try {
                await store.dispatch('people/fetchPeople');
            } catch (error) {
                console.error('Failed to load presenters:', error);
            }
        };

        const addNewPresenter = () => {
            router.push('/admin/presenters/new');
        };

        const editPresenter = (presenter: Presenter) => {
            router.push(`/admin/presenters/${presenter.id}`);
        };

        const deletePresenterHandler = async (presenter: Presenter) => {
            try {
                await store.dispatch('admin/verifyAccess');
                const adminPassword = store.state.admin.password;
                
                if (!adminPassword) {
                    throw new Error('Admin password not found');
                }

                await deletePresenter(presenter.id, adminPassword);
                await loadPresenters();
            } catch (error) {
                console.error('Failed to delete presenter:', error);
            }
        };

        onMounted(() => {
            loadPresenters();
        });

        return {
            presenters,
            isLoading,
            error,
            addNewPresenter,
            editPresenter,
            deletePresenter: deletePresenterHandler,
            add,
            pencil,
            trash
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

ion-avatar {
    width: 50px;
    height: 50px;
}

ion-avatar img {
    object-fit: cover;
}
</style> 