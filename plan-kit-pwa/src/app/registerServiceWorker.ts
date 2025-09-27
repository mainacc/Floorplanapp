export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.info('Service worker registered', registration);
    } catch (error) {
      console.warn('Service worker registration failed', error);
    }
  }
}
