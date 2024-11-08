<template>
    <BaseLayout :pageTitle="pageTitle">
        <slot />
        <template v-slot:footer>
            <MenuLayoutFooterToolbar />
        </template>
        <template v-slot:header>
            <MainLayoutHeaderToolbarBell />
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
