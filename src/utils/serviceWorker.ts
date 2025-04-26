import { registerSW, RegisterSWOptions } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  const options: RegisterSWOptions = {
    onNeedRefresh() {
      // Show a prompt to the user to refresh the page
      if (confirm('New content is available! Click OK to refresh.')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App is ready for offline use');
    },
    onRegistered(registration) {
      if (registration) {
        console.log('Service Worker registered:', registration);
        
        // Check if the service worker is active
        if (registration.active) {
          console.log('Service Worker is active');
        }
        
        // Check if the service worker is controlling the page
        if (navigator.serviceWorker.controller) {
          console.log('Service Worker is controlling the page');
        }

        // Setup message listener for notifications
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'NOTIFICATION') {
            const { title, options } = event.data;
            if (Notification.permission === 'granted') {
              registration.showNotification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                ...options
              });
            }
          }
        });
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    }
  };

  const updateSW = registerSW(options);
}; 