<template>
	<div>
		<AnnouncementsBlock
			v-for="(block, index) in blocks"
			:key="index"
			:block="block"
			@mark-read="markAsRead"
		/>
	</div>
</template>
	
<script>
import { mapActions } from 'vuex';
import { requestNotificationPermission } from '@/utils/notifications';

export default {
	props: {
		blocks: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	methods: {
		...mapActions('announcements', ['markAsRead'])
	},
	async mounted() {
		await requestNotificationPermission();
	}
}
</script>
