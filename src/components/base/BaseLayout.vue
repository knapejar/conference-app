<template>
    <MainLayoutNotificationsMenu />
    <ion-page id="main-content" v-bind="$attrs" tabindex="0" @ionViewWillEnter="handleViewEnter">
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
import MainLayoutNotificationsMenu from '../MainLayout/notificationsMenu/MainLayoutNotificationsMenu.vue';

export default {
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    },
    mounted() {
        // Ensure the main content is focusable
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '0');
        }
    },
    methods: {
        handleViewEnter() {
            // When the view becomes active, ensure proper focus management
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                // Remove aria-hidden if it exists
                mainContent.removeAttribute('aria-hidden');
                
                // Check if there's a stored focus element from the tab
                const currentTab = document.querySelector('ion-tab-button[selected]');
                if (currentTab && currentTab.dataset.lastFocusedElement) {
                    const lastFocused = document.getElementById(currentTab.dataset.lastFocusedElement);
                    if (lastFocused) {
                        lastFocused.focus();
                    }
                }
            }
        }
    }
}
</script>