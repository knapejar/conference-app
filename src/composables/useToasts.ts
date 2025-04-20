import { ref } from 'vue';
import OfflineWarning from '../components/helpers/OfflineWarning.vue';
import ErrorOccured from '../components/helpers/ErrorOccured.vue';

export const useToasts = () => {
  const offlineWarningRef = ref<InstanceType<typeof OfflineWarning> | null>(null);
  const errorOccuredRef = ref<InstanceType<typeof ErrorOccured> | null>(null);

  const showOfflineWarning = () => {
    offlineWarningRef.value?.show();
  };

  const showError = () => {
    errorOccuredRef.value?.show();
  };

  return {
    offlineWarningRef,
    errorOccuredRef,
    showOfflineWarning,
    showError
  };
}; 