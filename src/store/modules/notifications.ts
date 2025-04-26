import { requestNotificationPermission, showNotification, setupNotificationListener } from '@/utils/notifications';

interface NotificationState {
  permission: NotificationPermission;
  notifications: Array<{
    title: string;
    options: NotificationOptions;
    timestamp: Date;
  }>;
  isEnabled: boolean;
}

interface NotificationPayload {
  title: string;
  options: NotificationOptions;
}

export default {
  namespaced: true,
  state: {
    permission: Notification.permission,
    notifications: [],
    isEnabled: false
  } as NotificationState,
  mutations: {
    setPermission(state: NotificationState, permission: NotificationPermission) {
      state.permission = permission;
    },
    addNotification(state: NotificationState, notification: NotificationPayload & { timestamp: Date }) {
      state.notifications.push(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.shift();
      }
    },
    setEnabled(state: NotificationState, enabled: boolean) {
      state.isEnabled = enabled;
    }
  },
  actions: {
    async requestPermission({ commit }: { commit: Function }) {
      const granted = await requestNotificationPermission();
      commit('setPermission', Notification.permission);
      commit('setEnabled', granted);
      return granted;
    },
    showNotification({ commit }: { commit: Function }, { title, options }: NotificationPayload) {
      showNotification(title, options);
      commit('addNotification', { title, options, timestamp: new Date() });
    },
    setupNotifications({ commit }: { commit: Function }) {
      setupNotificationListener();
      commit('setEnabled', Notification.permission === 'granted');
    }
  },
  getters: {
    hasPermission: (state: NotificationState) => state.permission === 'granted',
    isEnabled: (state: NotificationState) => state.isEnabled,
    recentNotifications: (state: NotificationState) => [...state.notifications].reverse()
  }
}; 