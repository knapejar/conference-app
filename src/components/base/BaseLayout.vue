<template>
    <MainLayoutNotificationsMenu />
    <ion-page id="main-content" v-bind="$attrs">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button />
                </ion-buttons>
                <slot name="header" />
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