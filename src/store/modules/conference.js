import { getInitialUpdate } from '@/api';

export default {
  namespaced: true,
  state: {
    name: 'Conference App',
    description: 'Welcome to our conference application. This is a platform for managing conference presentations, questions, and networking.',
    welcomeImage: 'https://via.placeholder.com/800x400?text=Welcome+to+Conference',
    isLoggedIn: false,
    userId: null,
    loading: false,
    error: null
  },
  mutations: {
    setConferenceData(state, data) {
      state.name = data.name || state.name;
      state.description = data.description || state.description;
      state.welcomeImage = data.welcomeImage || state.welcomeImage;
    },
    setLoginState(state, { isLoggedIn, userId }) {
      state.isLoggedIn = isLoggedIn;
      state.userId = userId;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    initializeApp({ commit, dispatch }) {
      // Load conference data from localStorage if available
      const savedData = localStorage.getItem('conferenceData');
      if (savedData) {
        commit('setConferenceData', JSON.parse(savedData));
      }
      
      // Check if user is logged in
      const userId = localStorage.getItem('userId');
      if (userId) {
        commit('setLoginState', { isLoggedIn: true, userId });
      }
      
      // Fetch initial data from API
      dispatch('fetchConferenceData');
    },
    async fetchConferenceData({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const data = await getInitialUpdate();
        if (data && data.conference) {
          commit('setConferenceData', data.conference);
          // Save to localStorage
          localStorage.setItem('conferenceData', JSON.stringify(data.conference));
        }
      } catch (error) {
        console.error('Error fetching conference data:', error);
        commit('setError', error.message || 'Failed to fetch conference data');
      } finally {
        commit('setLoading', false);
      }
    },
    updateConferenceData({ commit, state }, data) {
      commit('setConferenceData', data);
      localStorage.setItem('conferenceData', JSON.stringify(state));
    },
    login({ commit }, userId) {
      commit('setLoginState', { isLoggedIn: true, userId });
      localStorage.setItem('userId', userId);
    },
    logout({ commit }) {
      commit('setLoginState', { isLoggedIn: false, userId: null });
      localStorage.removeItem('userId');
    }
  },
  getters: {
    getConferenceData: state => ({
      name: state.name,
      description: state.description,
      welcomeImage: state.welcomeImage
    }),
    isLoggedIn: state => state.isLoggedIn,
    getUserId: state => state.userId,
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 