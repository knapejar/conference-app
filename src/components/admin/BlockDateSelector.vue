<template>
    <ion-item>
        <ion-label position="stacked">{{ label }} ({{ formattedTime }})</ion-label>
        <input
            type="datetime-local"
            :value="localTimeValue"
            :min="minDate"
            :max="maxDate"
            @input="handleChange"
            class="datetime-input"
        />
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
        const localTimeValue = computed(() => {
            if (!props.modelValue) return '';
            return props.modelValue.slice(0, 16); // Just take the date and time part
        });

        const formattedTime = computed(() => {
            if (!props.modelValue) return '';
            const date = new Date(props.modelValue);
            return date.toLocaleTimeString('cs-CZ', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        });

        const handleChange = (event: Event) => {
            const input = event.target as HTMLInputElement;
            if (!input.value) return;
            
            // Just emit the value directly
            emit('update:modelValue', input.value);
        };

        return {
            handleChange,
            formattedTime,
            localTimeValue
        };
    }
});
</script>

<style scoped>
.datetime-input {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--ion-color-medium);
    border-radius: 4px;
    background-color: var(--ion-background-color);
    color: var(--ion-text-color);
    font-size: 16px;
    margin: 8px 0;
}

.datetime-input:focus {
    outline: none;
    border-color: var(--ion-color-primary);
}
</style> 