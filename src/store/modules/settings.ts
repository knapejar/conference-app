import { Module } from 'vuex';
import { SettingsState, RootState } from '@/store/types';

const settingsModule: Module<SettingsState, RootState> = {
  namespaced: true,
  state: {
    userSettings: {
      name: '',
      email: '',
      phone: '',
      linkedinUrl: ''
    },
    authorToken: null
  },
  mutations: {
    SET_USER_SETTINGS(state: SettingsState, settings: SettingsState['userSettings']) {
      state.userSettings = { ...settings }
    },
    UPDATE_USER_SETTING(state: SettingsState, { key, value }: { key: keyof SettingsState['userSettings']; value: string }) {
      state.userSettings[key] = value
    },
    SET_AUTHOR_TOKEN(state: SettingsState, token: string) {
      state.authorToken = token
    }
  },
  actions: {
    updateUserSettings({ commit }, settings: SettingsState['userSettings']) {
      commit('SET_USER_SETTINGS', settings)
      localStorage.setItem('userSettings', JSON.stringify(settings))
    },
    updateUserSetting({ commit, state }, { key, value }: { key: keyof SettingsState['userSettings']; value: string }) {
      commit('UPDATE_USER_SETTING', { key, value })
      const updatedSettings = { ...state.userSettings }
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings))
    },
    loadUserSettings({ commit }) {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        commit('SET_USER_SETTINGS', JSON.parse(savedSettings))
      }
      
      // Generate and store author token if not exists
      const savedToken = localStorage.getItem('authorToken')
      if (!savedToken) {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
        localStorage.setItem('authorToken', token)
        commit('SET_AUTHOR_TOKEN', token)
      } else {
        commit('SET_AUTHOR_TOKEN', savedToken)
      }
    },
    getAuthorToken({ state }): string {
      if (!state.authorToken) {
        throw new Error('Author token not initialized')
      }
      return state.authorToken
    }
  },
  getters: {
    getUserSettings: (state: SettingsState) => state.userSettings,
    getAuthorToken: (state: SettingsState) => state.authorToken
  }
};

export default settingsModule; 