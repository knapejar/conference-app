/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/api' {
  export function getDebugToken(): Promise<string>;
  export function getInitialUpdate(deviceToken: string): Promise<{
    announcements: any[];
    blocks: any[];
    conference: any;
    presenters: any[];
  }>;
}

declare module '@/composables/useVuexStore.js' {
  import { Store } from 'vuex';
  
  interface CustomStore extends Store<any> {
    login(token: string): void;
  }
  
  export function useStore(): CustomStore;
} 