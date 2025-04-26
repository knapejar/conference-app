import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const showNotification = (title: string, options: NotificationOptions = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
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
  }
};

export const setupNotificationListener = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION') {
        const { title, options } = event.data;
        showNotification(title, options);
      }
    });
  }
}; 