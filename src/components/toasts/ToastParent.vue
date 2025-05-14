<template>
  <ion-toast
    :is-open="isOpen"
    :message="message"
    :duration="duration"
    :position="position"
    @didDismiss="handleDismiss"
  ></ion-toast>
</template>

<script setup lang="ts">
import { IonToast } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const props = defineProps<{
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  showState: boolean;
}>();

const store = useStore();
const isOpen = ref(false);

watch(() => props.showState, (newVal) => {
  isOpen.value = newVal;
});

const handleDismiss = () => {
  isOpen.value = false;
};
</script> 