<template>
    <BaseLayout :pageTitle="person?.name || 'Detail osoby'">
        <ion-content v-if="person">
            <ion-card>
                <ion-card-content>
                    <div class="person-detail">
                        <img :src="person.imageURL" alt="Profile image" class="person-image" />
                        <h1>{{ person.name }}</h1>
                        <p class="role">{{ person.role }}</p>
                        <p class="details">{{ person.details }}</p>
                    </div>
                </ion-card-content>
            </ion-card>
        </ion-content>
        <ion-content v-else-if="loading">
            <ion-card>
                <ion-card-content>
                    <div class="person-detail">
                        <ion-spinner name="crescent"></ion-spinner>
                        <p>Načítání...</p>
                    </div>
                </ion-card-content>
            </ion-card>
        </ion-content>
        <ion-content v-else>
            <ion-card>
                <ion-card-content>
                    <div class="person-detail">
                        <p>Osoba nebyla nalezena</p>
                    </div>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </BaseLayout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/composables/useVuexStore';
import { useRoute } from 'vue-router';

interface Person {
    id: string;
    name: string;
    role: string;
    details: string;
    imageURL: string;
}

export default defineComponent({
    name: 'PersonDetail',
    setup() {
        const store = useStore();
        const route = useRoute();
        const personId = route.params.id as string;

        const loading = computed(() => store.getters['people/isLoading']);
        const error = computed(() => store.getters['people/getError']);

        // Fetch people data if not already loaded
        onMounted(async () => {
            const people = store.getters['people/getPeople'];
            if (!people || people.length === 0) {
                await store.dispatch('people/fetchPeople');
            }
        });

        const person = computed<Person | null>(() => {
            const people = store.getters['people/getPeople'];
            if (!people || !Array.isArray(people)) return null;
            return people.find((p: Person) => String(p.id) === String(personId)) || null;
        });

        return {
            person,
            loading,
            error
        };
    }
});
</script>

<style scoped>
.person-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
}

.person-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
}

.role {
    color: var(--ion-color-medium);
    margin: 10px 0;
}

.details {
    text-align: justify;
    white-space: pre-line;
}
</style> 