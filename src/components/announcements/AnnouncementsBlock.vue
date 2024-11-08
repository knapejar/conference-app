<template>
	<ion-item :class="{ 'ion-item-unread': !block.read }" class="ion-margin-vertical">
		<ion-avatar slot="start">
			<ion-icon
				:icon="getNotificationIcon"
				:color="getIconColor"
				class="ion-padding-small"
				size="large"
			></ion-icon>
		</ion-avatar>

		<ion-label class="ion-text-wrap">
			<ion-grid class="ion-no-padding">
				<ion-row class="ion-align-items-center ion-justify-content-between">
					<ion-col size="auto">
						<h2 class="ion-text-wrap ion-text-medium">{{ block.title }}</h2>
					</ion-col>
					<ion-col size="auto">
						<ion-badge v-if="!block.read" color="primary">New</ion-badge>
					</ion-col>
				</ion-row>

				<ion-row>
					<ion-col>
						<ion-text color="medium">
							<p class="ion-text-wrap">{{ block.message }}</p>
						</ion-text>
					</ion-col>
				</ion-row>

				<ion-row class="ion-align-items-center">
					<ion-col size="auto">
						<ion-note color="medium">{{ getRelativeTime }}</ion-note>
					</ion-col>
					<ion-col size="auto">
						<ion-chip 
							v-if="block.category" 
							:color="getCategoryColor" 
							outline
							size="small"
						>
							<ion-label>{{ block.category }}</ion-label>
						</ion-chip>
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-label>

		<ion-button 
			v-if="!block.read"
			fill="clear"
			slot="end"
			@click="markAsRead"
		>
			<ion-icon 
				slot="icon-only" 
				:icon="checkmarkCircleOutline"
				color="primary"
			></ion-icon>
		</ion-button>
	</ion-item>
</template>

<script>
import { 
	alertCircleOutline, 
	checkmarkCircleOutline,
	informationCircleOutline,
	warningOutline
} from 'ionicons/icons';

export default {
	name: 'NotificationBlock',
	props: {
		block: {
			type: Object,
			required: true,
			validator: (obj) => {
				return obj.hasOwnProperty('date') && 
							 obj.hasOwnProperty('message') &&
							 obj.hasOwnProperty('title');
			}
		}
	},
	data() {
		return {
			checkmarkCircleOutline
		};
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
}
</script>