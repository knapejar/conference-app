<template>
    <BaseLayout :pageTitle="pageTitle">
        <slot />
        <template v-slot:footer>
            <MenuLayoutFooterToolbar />
        </template>
        <template v-slot:header>
            <MainLayoutHeaderToolbarBell />
            <MainLayoutHeaderToolbarSettings />
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '../base/BaseLayout.vue';
import MainLayoutHeaderToolbarSettings from './headerToolbar/MainLayoutHeaderToolbarSettings.vue';

export default {
    components: {
        BaseLayout,
        MainLayoutHeaderToolbarSettings
    },
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>
