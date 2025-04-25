<template>
    <ion-item>
        <ion-label position="stacked">{{ label }} ({{ formattedTime }})</ion-label>
        <ion-datetime-button :datetime="datetimeId"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
            <ion-datetime
                :id="datetimeId"
                :value="localTimeValue"
                presentation="date-time"
                :min="minDate"
                :max="maxDate"
                @ionChange="handleChange"
            ></ion-datetime>
        </ion-modal>
    </ion-item>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'BlockDateSelector',
    props: {
        modelValue: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        minDate: {
            type: String,
            required: true
        },
        maxDate: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const datetimeId = ref(`datetime-${Math.random().toString(36).substr(2, 9)}`);

        const localTimeValue = computed(() => {
            const date = new Date(props.modelValue);
            const timezoneOffset = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() - timezoneOffset);
            return date.toISOString().split('.')[0];
        });

        const formattedTime = computed(() => {
            return new Date(props.modelValue).toLocaleTimeString();
        });

        const handleChange = (event: CustomEvent) => {
            const date = new Date(event.detail.value);
            const timezoneOffset = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() + timezoneOffset);
            emit('update:modelValue', date.toISOString().split('.')[0]);
        };

        return {
            datetimeId,
            handleChange,
            formattedTime,
            localTimeValue
        };
    }
});
</script>

<style scoped>
ion-datetime {
    width: 100%;
}
</style> 