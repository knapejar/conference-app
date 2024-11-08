<template>
	<ion-list :inset="true">
		<AnnouncementsBlock
			v-for="(block, index) in blocks"
			:key="index"
			:block="block"
		/>
	</ion-list>
</template>
	
<script>
	export default {
		props: {
			blocks: {
				type: Array,
				required: true
			}
		}
	}
</script>
