import { getAnnouncements } from '@/api';

function loadAnnouncements() {
  const stored = localStorage.getItem('announcements');
  return stored ? JSON.parse(stored) : [];
}

function loadReadNotifications() {
  const stored = localStorage.getItem('readNotifications');
  return stored ? JSON.parse(stored) : [];
}

export default {
  namespaced: true,
  state: {
    announcements: loadAnnouncements(),
    readNotifications: loadReadNotifications(),
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
      if (state.announcements.length === 0) {
        state.error = error;
      } else {
        state.error = null;
      }
    },
    markAnnouncementAsRead(state, announcementId) {
      if (!state.readNotifications.includes(announcementId)) {
        state.readNotifications.push(announcementId);
        localStorage.setItem('readNotifications', JSON.stringify(state.readNotifications));
      }
    }
  },
  actions: {
    async fetchAnnouncements({ commit, state }) {
      if (state.announcements.length === 0) {
        commit('setLoading', true);
      }
      commit('setError', null);
      
      try {
        const announcements = await getAnnouncements();
        if (announcements) {
          commit('setAnnouncements', announcements);
        } else {
          console.warn('No announcements data received');
          if (state.announcements.length === 0) {
            commit('setAnnouncements', []);
          }
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        if (state.announcements.length === 0) {
          commit('setError', error.message || 'Failed to fetch announcements');
        } else {
          console.error('Network error, using cached announcements:', error);
        }
      } finally {
        commit('setLoading', false);
      }
    },
    markAsRead({ commit }, announcementId) {
      commit('markAnnouncementAsRead', announcementId);
    }
  },
  getters: {
    getAnnouncements: state => state.announcements.filter(a => !state.readNotifications.includes(a.id)),
    getUnreadAnnouncements: state => state.announcements.filter(a => !state.readNotifications.includes(a.id)),
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 