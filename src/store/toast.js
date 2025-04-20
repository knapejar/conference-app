export default {
  namespaced: true,
  state: {
    offlineWarning: false,
    errorOccurred: false
  },
  mutations: {
    SHOW_OFFLINE_WARNING(state) {
      state.offlineWarning = true;
    },
    HIDE_OFFLINE_WARNING(state) {
      state.offlineWarning = false;
    },
    SHOW_ERROR(state) {
      state.errorOccurred = true;
    },
    HIDE_ERROR(state) {
      state.errorOccurred = false;
    }
  },
  actions: {
    showOfflineWarning({ commit }) {
      commit('SHOW_OFFLINE_WARNING');
      setTimeout(() => {
        commit('HIDE_OFFLINE_WARNING');
      }, 5000);
    },
    showError({ commit }) {
      commit('SHOW_ERROR');
      setTimeout(() => {
        commit('HIDE_ERROR');
      }, 5000);
    }
  }
}; 