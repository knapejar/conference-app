<template>
	<ion-menu content-id="main-content" side="end" @ionDidOpen="handleMenuOpen" @ionDidClose="handleMenuClose">
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
import { ref } from 'vue'

const store = useStore()
let mainContent = ref(null)

const markAsRead = (announcementId) => {
	store.dispatch('announcements/markAsRead', announcementId);
}

const handleMenuOpen = () => {
	mainContent.value = document.getElementById('main-content')
	if (mainContent.value) {
		// Store the currently focused element
		const activeElement = document.activeElement
		// Move focus to the menu
		mainContent.value.querySelector('ion-menu-toggle ion-button').focus()
		// Store the previous focus for restoration
		mainContent.value.dataset.previousFocus = activeElement ? activeElement.id : ''
	}
}

const handleMenuClose = () => {
	if (mainContent.value) {
		// Restore focus to the previously focused element
		const previousFocusId = mainContent.value.dataset.previousFocus
		if (previousFocusId) {
			const previousFocus = document.getElementById(previousFocusId)
			if (previousFocus) {
				previousFocus.focus()
			}
		}
	}
}
</script>