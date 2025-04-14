const state = {
  userSettings: {
    name: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  }
}

const mutations = {
  SET_USER_SETTINGS(state, settings) {
    state.userSettings = { ...settings }
  },
  UPDATE_USER_SETTING(state, { key, value }) {
    state.userSettings[key] = value
  }
}

const actions = {
  updateUserSettings({ commit }, settings) {
    commit('SET_USER_SETTINGS', settings)
    // Here you would typically also save to localStorage or backend
    localStorage.setItem('userSettings', JSON.stringify(settings))
  },
  updateUserSetting({ commit, state }, { key, value }) {
    commit('UPDATE_USER_SETTING', { key, value })
    const updatedSettings = { ...state.userSettings }
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings))
  },
  loadUserSettings({ commit }) {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      commit('SET_USER_SETTINGS', JSON.parse(savedSettings))
    }
  }
}

const getters = {
  getUserSettings: state => state.userSettings
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 