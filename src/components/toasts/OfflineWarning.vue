<template>
  <ToastParent
    message="Jste offline, zkouším se připojit."
    :duration="5000"
    position="bottom"
    :show-state="offlineWarning"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import ToastParent from './ToastParent.vue';

const store = useStore();
const offlineWarning = computed(() => store.state.toast.offlineWarning);
</script> 