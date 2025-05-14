import { Store } from 'vuex';

declare module '@/composables/useVuexStore' {
  export function useStore(): Store<any>;
} 