<template>
	<div>
		<AnnouncementsBlock
			v-for="(block, index) in blocks"
			:key="index"
			:block="block"
		/>
	</div>
</template>
	
<script>
	export default {
		props: {
			blocks: {
				type: Array,
				required: false,
				default: () => []
			}
		}
	}
</script>
