import { useStore as baseUseStore } from 'vuex'

/**
 * Custom Vuex store composable that initializes the app with all necessary data
 * @returns {import('vuex').Store} The Vuex store instance
 * @type {() => import('vuex').Store}
 */
export const useStore = () => {
  const store = baseUseStore()
  
  // Initialize the app and fetch all initial data
  store.dispatch('conference/initializeApp');
  store.dispatch('presentations/fetchPresentations');
  store.dispatch('people/fetchPeople');
  store.dispatch('announcements/fetchAnnouncements');
  
  return store
}