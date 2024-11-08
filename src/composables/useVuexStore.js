import { useStore as baseUseStore } from 'vuex'

export const useStore = () => {
  const store = baseUseStore()
  return store
}