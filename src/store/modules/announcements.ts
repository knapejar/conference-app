import { ActionContext } from 'vuex';
import axios from 'axios';

function loadAnnouncements() {
  const stored = localStorage.getItem('announcements');
  return stored ? JSON.parse(stored) : [];
}

function loadReadNotifications() {
  const stored = localStorage.getItem('readNotifications');
  return stored ? JSON.parse(stored) : [];
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  category: string;
  type: string;
}

interface AnnouncementsState {
  announcements: Announcement[];
  readNotifications: number[];
  loading: boolean;
  error: string | null;
}

type AnnouncementsContext = ActionContext<AnnouncementsState, any>;

export default {
  namespaced: true,
  state: {
    announcements: loadAnnouncements(),
    readNotifications: loadReadNotifications(),
    loading: false,
    error: null
  } as AnnouncementsState,
  mutations: {
    setAnnouncements(state: AnnouncementsState, announcements: Announcement[]) {
      state.announcements = announcements;
      localStorage.setItem('announcements', JSON.stringify(announcements));
    },
    setLoading(state: AnnouncementsState, loading: boolean) {
      state.loading = loading;
    },
    setError(state: AnnouncementsState, error: string | null) {
      if (state.announcements.length === 0) {
        state.error = error;
      } else {
        state.error = null;
      }
    },
    markAnnouncementAsRead(state: AnnouncementsState, announcementId: number) {
      if (!state.readNotifications.includes(announcementId)) {
        state.readNotifications.push(announcementId);
        localStorage.setItem('readNotifications', JSON.stringify(state.readNotifications));
      }
    }
  },
  actions: {
    async fetchAnnouncements({ commit, dispatch, state }: AnnouncementsContext) {
      if (state.announcements.length === 0) {
        commit('setLoading', true);
      }
      commit('setError', null);
      
      try {
        const response = await axios.get('/announcements');
        const announcements = response.data;
        
        if (announcements) {
          // Find new announcements by comparing with existing ones
          const existingIds = new Set(state.announcements.map(a => a.id));
          const newAnnouncements = announcements.filter((a: Announcement) => !existingIds.has(a.id));
          
          // Update announcements in store
          commit('setAnnouncements', announcements);
          
          // Show notifications for new announcements
          if (newAnnouncements.length > 0) {
            newAnnouncements.forEach((announcement: Announcement) => {
              dispatch('notifications/showNotification', {
                title: announcement.title,
                options: {
                  body: announcement.message,
                  data: { announcementId: announcement.id },
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/icon-192x192.png',
                  tag: `announcement-${announcement.id}`,
                  renotify: true
                }
              }, { root: true });
            });
          }
        } else {
          console.warn('No announcements data received');
          if (state.announcements.length === 0) {
            commit('setAnnouncements', []);
          }
        }
      } catch (error: any) {
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
    markAsRead({ commit }: AnnouncementsContext, announcementId: number) {
      commit('markAnnouncementAsRead', announcementId);
    }
  },
  getters: {
    getAnnouncements: (state: AnnouncementsState) => state.announcements,
    getUnreadAnnouncements: (state: AnnouncementsState) => 
      state.announcements.filter(a => !state.readNotifications.includes(a.id)),
    isLoading: (state: AnnouncementsState) => state.loading,
    getError: (state: AnnouncementsState) => state.error
  }
}; 