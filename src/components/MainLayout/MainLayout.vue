<template>
    <BaseLayout :pageTitle="pageTitle">
        <MainLayoutRefresher />
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
import MainLayoutRefresher from './MainLayoutRefresher.vue';

export default {
    components: {
        BaseLayout,
        MainLayoutHeaderToolbarSettings,
        MainLayoutRefresher
    },
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>
