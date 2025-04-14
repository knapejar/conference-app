interface UserSettings {
  name: string;
  email: string;
  phone: string;
  linkedinUrl: string;
}

interface SettingsState {
  userSettings: UserSettings;
}

const state: SettingsState = {
  userSettings: {
    name: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  }
}

const mutations = {
  SET_USER_SETTINGS(state: SettingsState, settings: UserSettings) {
    state.userSettings = { ...settings }
  },
  UPDATE_USER_SETTING(state: SettingsState, { key, value }: { key: keyof UserSettings; value: string }) {
    state.userSettings[key] = value
  }
}

const actions = {
  updateUserSettings({ commit }: { commit: Function }, settings: UserSettings) {
    commit('SET_USER_SETTINGS', settings)
    localStorage.setItem('userSettings', JSON.stringify(settings))
  },
  updateUserSetting({ commit, state }: { commit: Function; state: SettingsState }, { key, value }: { key: keyof UserSettings; value: string }) {
    commit('UPDATE_USER_SETTING', { key, value })
    const updatedSettings = { ...state.userSettings }
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings))
  },
  loadUserSettings({ commit }: { commit: Function }) {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      commit('SET_USER_SETTINGS', JSON.parse(savedSettings))
    }
  }
}

const getters = {
  getUserSettings: (state: SettingsState) => state.userSettings
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 