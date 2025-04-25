<template>
    <BaseLayout :page-title="isNew ? 'Nový prezentér' : 'Upravit prezentéra'">
        <ion-list>
            <ion-item>
                <ion-label position="stacked">Jméno</ion-label>
                <ion-input v-model="presenterData.name" placeholder="Zadejte jméno prezentéra"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Role</ion-label>
                <ion-input v-model="presenterData.role" placeholder="Zadejte roli prezentéra"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Popis</ion-label>
                <ion-textarea v-model="presenterData.details" placeholder="Zadejte popis prezentéra"></ion-textarea>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Prezentace</ion-label>
                <ion-select v-model="presenterData.presentationId" placeholder="Vyberte prezentaci">
                    <ion-select-option v-for="block in blocks" :key="block.id">
                        <template v-for="presentation in block.presentations" :key="presentation.id">
                            <ion-select-option :value="presentation.id">
                                {{ presentation.title }} ({{ block.blockName }})
                            </ion-select-option>
                        </template>
                    </ion-select-option>
                </ion-select>
            </ion-item>

            <ion-item>
                <ion-label position="stacked">Fotografie</ion-label>
                <div class="image-container">
                    <img v-if="presenterData.imageURL" :src="presenterData.imageURL" alt="Presenter photo" class="preview-image" />
                    <div class="image-upload">
                        <ion-button color="medium" @click="triggerFileInput">
                            <ion-icon :icon="image" slot="start"></ion-icon>
                            {{ presenterData.imageURL ? 'Změnit fotografii' : 'Nahrát fotografii' }}
                        </ion-button>
                        <input
                            type="file"
                            ref="fileInput"
                            @change="handleImageUpload"
                            accept="image/*"
                            style="display: none"
                        />
                    </div>
                </div>
            </ion-item>
        </ion-list>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="savePresenter">
                <ion-icon :icon="save"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </BaseLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { save, image } from 'ionicons/icons';
import { createPresenter, updatePresenter } from '@/api/admin';

interface PresenterData {
    id?: string;
    name: string;
    role: string;
    imageURL: string;
    details: string;
    presentationId: string;
    imageFile?: File;
}

export default defineComponent({
    name: 'PresenterEditor',
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const presenterId = route.params.id as string;
        const isNew = !presenterId;

        const presenterData = ref<PresenterData>({
            name: '',
            role: '',
            imageURL: '',
            details: '',
            presentationId: ''
        });

        const blocks = computed(() => store.getters['presentations/getBlocks']);

        const fileInput = ref<HTMLInputElement | null>(null);

        const triggerFileInput = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

        const loadPresenter = async () => {
            if (!isNew) {
                await store.dispatch('people/fetchPeople');
                
                const presenters = store.getters['people/getPeople'];
                const presenter = presenters.find((p: any) => String(p.id) === String(presenterId));
                
                if (presenter) {
                    presenterData.value = {
                        id: presenter.id,
                        name: presenter.name,
                        role: presenter.role,
                        imageURL: presenter.imageURL,
                        details: presenter.details,
                        presentationId: String(presenter.presentationId)
                    };
                } else {
                    console.error('Presenter not found:', presenterId);
                }
            }
        };

        const handleImageUpload = (event: Event) => {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files[0]) {
                const file = input.files[0];
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('Soubor je příliš velký. Maximální velikost je 5MB.');
                    return;
                }
                presenterData.value.imageFile = file;
                presenterData.value.imageURL = URL.createObjectURL(file);
            }
        };

        const savePresenter = async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                
                const adminPassword = store.state.admin.password;
                if (!adminPassword) {
                    throw new Error('Admin password not found. Please log in again.');
                }

                if (!presenterData.value.name) {
                    throw new Error('Name is required');
                }

                const formData = new FormData();
                formData.append('name', presenterData.value.name);
                formData.append('role', presenterData.value.role || '');
                formData.append('details', presenterData.value.details || '');
                formData.append('presentationId', presenterData.value.presentationId || '');
                
                if (presenterData.value.imageFile) {
                    formData.append('image', presenterData.value.imageFile);
                } else if (presenterData.value.imageURL && !presenterData.value.imageURL.startsWith('blob:')) {
                    formData.append('imageURL', presenterData.value.imageURL);
                }

                if (isNew) {
                    await createPresenter(formData, adminPassword);
                } else {
                    await updatePresenter(presenterId, formData, adminPassword);
                }

                await store.dispatch('people/fetchPeople');
                router.push('/admin?tab=presenters');
            } catch (error: any) {
                console.error('Failed to save presenter:', error);
                if (error.message?.includes('password') || error.message?.includes('authentication')) {
                    router.push('/admin');
                }
            }
        };

        onMounted(async () => {
            try {
                await store.dispatch('admin/verifyAccess');
                await store.dispatch('presentations/fetchPresentations');
                await loadPresenter();
            } catch (error: any) {
                console.error('Authentication error:', error);
                router.push('/admin');
            }
        });

        return {
            presenterData,
            blocks,
            isNew,
            savePresenter,
            handleImageUpload,
            triggerFileInput,
            fileInput,
            save,
            image
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

.image-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 16px 0;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
    background-color: var(--ion-color-light-shade);
}

.image-upload {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style> 