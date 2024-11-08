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
			<AnnouncementsBlocks :blocks="$store.state.announcements" />
		</ion-content>
	</ion-menu>
</template>

<script setup> // TODO make $store global so this code is not needed
import { useStore } from '@/composables/useVuexStore'
const store = useStore()
</script>