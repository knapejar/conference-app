import { requestNotificationPermission, showNotification, setupNotificationListener, isNotificationSupported } from '@/utils/notifications';
import { Module } from 'vuex';
import { NotificationsState, RootState, NotificationPayload } from '@/store/types';

const notificationsModule: Module<NotificationsState, RootState> = {
  namespaced: true,
  state: {
    permission: isNotificationSupported() ? Notification.permission : 'denied',
    notifications: [],
    isEnabled: false,
    deviceToken: null,
    loading: false,
    error: null
  } as NotificationsState,
  mutations: {
    setPermission(state: NotificationsState, permission: NotificationPermission) {
      state.permission = permission;
    },
    addNotification(state: NotificationsState, notification: NotificationPayload & { timestamp: Date }) {
      state.notifications.push(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.shift();
      }
    },
    setEnabled(state: NotificationsState, enabled: boolean) {
      state.isEnabled = enabled;
    },
    setDeviceToken(state: NotificationsState, token: string | null) {
      state.deviceToken = token;
    },
    setLoading(state: NotificationsState, loading: boolean) {
      state.loading = loading;
    },
    setError(state: NotificationsState, error: string | null) {
      state.error = error;
    }
  },
  actions: {
    async requestPermission({ commit }) {
      if (!isNotificationSupported()) {
        commit('setPermission', 'denied');
        commit('setEnabled', false);
        return false;
      }

      const granted = await requestNotificationPermission();
      commit('setPermission', Notification.permission);
      commit('setEnabled', granted);
      return granted;
    },
    showNotification({ commit }, { title, options }: NotificationPayload) {
      if (isNotificationSupported()) {
        showNotification(title, options);
        commit('addNotification', { title, options, timestamp: new Date() });
      }
    },
    setupNotifications({ commit }) {
      if (isNotificationSupported()) {
        setupNotificationListener();
        commit('setEnabled', Notification.permission === 'granted');
      } else {
        commit('setEnabled', false);
      }
    }
  },
  getters: {
    hasPermission: (state: NotificationsState) => state.permission === 'granted',
    isEnabled: (state: NotificationsState) => state.isEnabled,
    recentNotifications: (state: NotificationsState) => [...state.notifications].reverse()
  }
};

export default notificationsModule; 