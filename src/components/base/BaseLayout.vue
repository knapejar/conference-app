<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button />
                </ion-buttons>
                <ion-title>{{ pageTitle }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <slot />
        </ion-content>
        <ion-footer>
            <slot name="footer" />
        </ion-footer>
    </ion-page>
</template>

<script>
export default {
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>