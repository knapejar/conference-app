import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window && window.Notification !== undefined;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const showNotification = (title: string, options: NotificationOptions = {}) => {
  if (!isNotificationSupported()) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        ...options
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();

        // Handle announcement navigation
        if (options.data?.announcementId) {
          const store = useStore();
          const router = useRouter();
          
          // Mark announcement as read
          store.dispatch('announcements/markAsRead', options.data.announcementId);
          
          // Navigate to announcements page
          router.push('/announcements');
        }
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

export const setupNotificationListener = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION') {
          const { title, options } = event.data;
          showNotification(title, options);
        }
      });
    } catch (error) {
      console.error('Error setting up notification listener:', error);
    }
  }
}; 