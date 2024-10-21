<template>
    <MainLayout :pageTitle="$store.state.conferenceName">
        <ion-img :src="$store.state.welcomeImage" class="image-responsive" />
        <ion-card>
            <ion-card-header>
                <ion-card-title>Welcome to {{ $store.state.conferenceName }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p class="justified-content">{{ $store.state.conferenceDescription }}</p>
            </ion-card-content>
        </ion-card>

        <div class="ion-padding"></div>
        <AnnouncementsBlocks :blocks = "$store.state.announcements" />
    </MainLayout>
</template>

<style scoped>
.justified-content {
    text-align: justify;
}
.image-responsive {
    width: 100%;
    height: auto;
}
</style>
