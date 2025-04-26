<template>
	<ion-toolbar>
		<ion-tabs @ionTabsWillChange="handleTabChange">
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<!-- Home (Domů) tab -->
				<ion-tab-button tab="home" href="/home" id="tab-home">
					<ion-icon name="home"></ion-icon>
					<ion-label>Domů</ion-label>
				</ion-tab-button>

				<!-- Program tab -->
				<ion-tab-button tab="program" href="/program" id="tab-program">
					<ion-icon name="calendar"></ion-icon>
					<ion-label>Program</ion-label>
				</ion-tab-button>

				<!-- People (Lidé) tab -->
				<ion-tab-button tab="people" href="/people" id="tab-people">
					<ion-icon name="people"></ion-icon>
					<ion-label>Lidé</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-toolbar>
</template>

<script setup>
import { ref } from 'vue'

const handleTabChange = (event) => {
	// Get the current active element
	const activeElement = document.activeElement
	
	// If there's an active element in the current tab
	if (activeElement && activeElement.closest('ion-page')) {
		// Store the current focus state
		const currentTab = document.querySelector('ion-tab-button[selected]')
		if (currentTab) {
			currentTab.dataset.lastFocusedElement = activeElement.id || ''
		}
	}
	
	// Focus the new tab button
	const newTab = document.getElementById(`tab-${event.detail.tab}`)
	if (newTab) {
		newTab.focus()
	}
}
</script>