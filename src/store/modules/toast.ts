import { Module } from 'vuex';

interface ToastState {
  offlineWarning: boolean;
  errorOccurred: boolean;
}

const toastModule: Module<ToastState, any> = {
  namespaced: true,
  state: {
    offlineWarning: false,
    errorOccurred: false
  },
  mutations: {
    SHOW_OFFLINE_WARNING(state: ToastState) {
      state.offlineWarning = true;
    },
    HIDE_OFFLINE_WARNING(state: ToastState) {
      state.offlineWarning = false;
    },
    SHOW_ERROR(state: ToastState) {
      state.errorOccurred = true;
    },
    HIDE_ERROR(state: ToastState) {
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

export default toastModule; 