interface UserSettings {
  name: string;
  email: string;
  phone: string;
  linkedinUrl: string;
}

interface SettingsState {
  userSettings: UserSettings;
  authorToken: string | null;
}

const state: SettingsState = {
  userSettings: {
    name: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  },
  authorToken: null
}

const mutations = {
  SET_USER_SETTINGS(state: SettingsState, settings: UserSettings) {
    state.userSettings = { ...settings }
  },
  UPDATE_USER_SETTING(state: SettingsState, { key, value }: { key: keyof UserSettings; value: string }) {
    state.userSettings[key] = value
  },
  SET_AUTHOR_TOKEN(state: SettingsState, token: string) {
    state.authorToken = token
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
  getAuthorToken({ state }: { state: SettingsState }): string {
    if (!state.authorToken) {
      throw new Error('Author token not initialized')
    }
    return state.authorToken
  }
}

const getters = {
  getUserSettings: (state: SettingsState) => state.userSettings,
  getAuthorToken: (state: SettingsState) => state.authorToken
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 