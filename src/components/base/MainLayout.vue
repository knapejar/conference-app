<template>
    <BaseLayout :pageTitle="pageTitle">
        <slot />
        <template v-slot:footer>
            <ion-toolbar>
                <ion-tabs>
                    <ion-router-outlet></ion-router-outlet>
                    <ion-tab-bar slot="bottom">
                        <!-- Home (Domů) tab -->
                        <ion-tab-button tab="home" href="/home">
                            <ion-icon name="home"></ion-icon>
                            <ion-label>Domů</ion-label>
                        </ion-tab-button>

                        <!-- Program tab -->
                        <ion-tab-button tab="program" href="/program">
                            <ion-icon name="calendar"></ion-icon>
                            <ion-label>Program</ion-label>
                        </ion-tab-button>

                        <!-- People (Lidé) tab -->
                        <ion-tab-button tab="people" href="/people">
                            <ion-icon name="people"></ion-icon>
                            <ion-label>Lidé</ion-label>
                        </ion-tab-button>
                    </ion-tab-bar>
                </ion-tabs>
            </ion-toolbar>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';

export default {
    components: {
        BaseLayout
    },
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>
