export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const swUrl = new URL('service-worker.js', import.meta.env.BASE_URL).toString();
      const registration = await navigator.serviceWorker.register(swUrl);
      console.info('Service worker registered', registration);
    } catch (error) {
      console.warn('Service worker registration failed', error);
    }
  }
}
