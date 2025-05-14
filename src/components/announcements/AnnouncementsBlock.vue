<template>
	<ion-card class="notification-card" :class="{ unread: !block.read }">
		<ion-card-header class="card-header">
			<ion-card-title class="ion-text-wrap">
				<ion-icon :icon="getNotificationIcon" :color="getIconColor" size="large"></ion-icon>
				<span>{{ block.title }}</span>
			</ion-card-title>
		</ion-card-header>

		<ion-card-content>
			<div class="notification-details">
				<div class="notification-meta">
					<ion-note color="medium">
						{{ getRelativeTime }}</ion-note>
					<ion-chip v-if="block.category" :color="getCategoryColor" outline size="small">
						<ion-label>{{ block.category }}</ion-label>
					</ion-chip>
				</div>
			</div>

			<p class="notification-message">{{ block.message }}</p>
		</ion-card-content>
	</ion-card>
</template>

<script>
import {
	informationCircleOutline,
	warningOutline,
	alertCircleOutline
} from 'ionicons/icons';

export default {
	name: 'NotificationBlock',
	props: {
		block: {
			type: Object,
			required: true,
			validator(obj) {
				return (
					obj.hasOwnProperty('date') &&
					obj.hasOwnProperty('message') &&
					obj.hasOwnProperty('title')
				);
			}
		}
	},
	computed: {
		getNotificationIcon() {
			const icons = {
				info: informationCircleOutline,
				warning: warningOutline,
				alert: alertCircleOutline,
				default: informationCircleOutline
			};
			return icons[this.block.type] || icons.default;
		},
		getIconColor() {
			const colors = {
				info: 'primary',
				warning: 'warning',
				alert: 'danger',
				default: 'medium'
			};
			return colors[this.block.type] || colors.default;
		},
		getCategoryColor() {
			const colors = {
				system: 'tertiary',
				security: 'danger',
				update: 'success',
				default: 'medium'
			};
			return colors[this.block.category] || colors.default;
		},
		getRelativeTime() {
			const now = new Date();
			const notifDate = new Date(this.block.date);
			const diffTime = Math.abs(now - notifDate);
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
			const diffMinutes = Math.floor(diffTime / (1000 * 60));

			if (diffDays > 0) {
				return `${diffDays}d ago`;
			} else if (diffHours > 0) {
				return `${diffHours}h ago`;
			} else if (diffMinutes > 0) {
				return `${diffMinutes}m ago`;
			}
			return 'Just now';
		}
	},
	methods: {
		markAsRead() {
			this.$emit('mark-read', this.block.id);
		}
	}
};
</script>

<style scoped>
.notification-card {
	margin: 1rem 0;
	border-left: 4px solid var(--ion-color-primary);
}

.card-header {
	position: relative;
}

.mark-as-read-icon {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	cursor: pointer;
	font-size: 1.5rem;
}
</style>