import { useStore as baseUseStore } from 'vuex'

let isInitialized = false;

/**
 * Custom Vuex store composable that initializes the app with all necessary data
 * @returns {import('vuex').Store} The Vuex store instance
 * @type {() => import('vuex').Store}
 */
export const useStore = () => {
  const store = baseUseStore()
  
  // Initialize the app and fetch all initial data only once
  if (!isInitialized) {
    store.dispatch('conference/initializeApp');
    store.dispatch('presentations/fetchPresentations');
    store.dispatch('people/fetchPeople');
    store.dispatch('announcements/fetchAnnouncements');
    isInitialized = true;
  }
  
  return store
}