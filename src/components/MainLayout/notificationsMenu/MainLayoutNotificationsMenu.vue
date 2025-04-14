<template>
	<ion-menu content-id="main-content" side="end">
		<ion-header>
			<ion-toolbar>
				<ion-title>Novinky</ion-title>
				<ion-buttons slot="end">
					<ion-menu-toggle>
						<ion-button>
							<ion-icon name="close"></ion-icon>
						</ion-button>
					</ion-menu-toggle>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<AnnouncementsBlocks 
				:blocks="$store.getters['announcements/getAnnouncements']" 
				@mark-read="markAsRead"
			/>
		</ion-content>
	</ion-menu>
</template>

<script setup>
// @ts-ignore
import { useStore } from '@/composables/useVuexStore'
const store = useStore()

const markAsRead = (announcementId) => {
	store.dispatch('announcements/markAsRead', announcementId);
}
</script>