<template>
    <MainLayout :pageTitle="$store.state.conferenceName">
        <PeopleList :people="$store.state.people" />
    </MainLayout>
</template>