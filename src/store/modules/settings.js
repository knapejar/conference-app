const state = {
  userSettings: {
    name: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    authorToken: null
  }
}

const mutations = {
  SET_USER_SETTINGS(state, settings) {
    state.userSettings = { ...settings }
  },
  UPDATE_USER_SETTING(state, { key, value }) {
    state.userSettings[key] = value
  },
  SET_AUTHOR_TOKEN(state, token) {
    state.userSettings.authorToken = token
  }
}

const actions = {
  updateUserSettings({ commit }, settings) {
    commit('SET_USER_SETTINGS', settings)
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
  },
  generateAuthorToken({ commit, state }) {
    if (!state.userSettings.authorToken) {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      commit('SET_AUTHOR_TOKEN', token)
      const updatedSettings = { ...state.userSettings }
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings))
      return token
    }
    return state.userSettings.authorToken
  }
}

const getters = {
  getUserSettings: state => state.userSettings,
  getAuthorToken: state => state.userSettings.authorToken
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 