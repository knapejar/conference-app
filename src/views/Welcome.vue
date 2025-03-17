<template>
    <BaseLayout :pageTitle=store.state.conference.name>
        <ion-img :src=store.state.conference.welcomeImage class="image-responsive" />
        <ion-card>
            <ion-card-header>
                <ion-card-title>Prosím, přihlašte se.</ion-card-title>
            </ion-card-header>
            <ion-card-content style="text-align: center;">
                <!--<p class="justified-content">{{ store.state.conference.description }}</p>-->
                <div class="ion-padding"></div>
                <h1>
                    Prosím, přihlašte se pomocí odkau ve Vašem emailu s pozvánkou na konferenci.
                </h1>
                <div class="ion-padding"></div>
            </ion-card-content>
        </ion-card>

        <div class="ion-padding"></div>
    </BaseLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/composables/useVuexStore.js';

export default defineComponent({
    setup() {
        const store = useStore();

        return {
            store,
        };
    },
});
</script>