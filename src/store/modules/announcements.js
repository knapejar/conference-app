import { getInitialUpdate } from '@/api';

// Helper function to load announcements from localStorage
function loadAnnouncements() {
  const stored = localStorage.getItem('announcements');
  return stored ? JSON.parse(stored) : [];
}

export default {
  namespaced: true,
  state: {
    announcements: loadAnnouncements(),
    loading: false,
    error: null
  },
  mutations: {
    setAnnouncements(state, announcements) {
      state.announcements = announcements;
      localStorage.setItem('announcements', JSON.stringify(announcements));
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    markAnnouncementAsRead(state, announcementId) {
      const announcement = state.announcements.find(a => a.id === announcementId);
      if (announcement) {
        announcement.read = true;
        localStorage.setItem('announcements', JSON.stringify(state.announcements));
      }
    }
  },
  actions: {
    async fetchAnnouncements({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        console.log('Fetching announcements...');
        const data = await getInitialUpdate();
        console.log('Received announcements data:', data);
        if (data && data.announcements) {
          commit('setAnnouncements', data.announcements);
        } else {
          console.warn('No announcements data received');
          commit('setAnnouncements', []);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        commit('setError', error.message || 'Failed to fetch announcements');
        commit('setAnnouncements', []);
      } finally {
        commit('setLoading', false);
      }
    },
    markAsRead({ commit }, announcementId) {
      commit('markAnnouncementAsRead', announcementId);
    }
  },
  getters: {
    getAnnouncements: state => state.announcements,
    getUnreadAnnouncements: state => state.announcements.filter(a => !a.read),
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 