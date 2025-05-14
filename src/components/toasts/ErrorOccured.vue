<template>
  <ToastParent
    message="Nastala chyba, prosím zkuste to znovu."
    :duration="5000"
    position="bottom"
    :show-state="errorOccurred"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import ToastParent from './ToastParent.vue';

const store = useStore();
const errorOccurred = computed(() => store.state.toast.errorOccurred);
</script> 