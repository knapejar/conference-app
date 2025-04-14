import { useStore as baseUseStore } from 'vuex'

export const useStore = () => {
  const store = baseUseStore()
  
  // Initialize the app and fetch all initial data
  store.dispatch('conference/initializeApp');
  store.dispatch('presentations/fetchPresentations');
  store.dispatch('people/fetchPeople');
  
  return store
}