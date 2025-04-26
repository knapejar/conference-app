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

export default {
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>
