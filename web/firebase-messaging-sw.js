importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

let messaging;
let isInitialized = false;
let translationsMap = null;

console.log('HDW [firebase-messaging-sw.js] Service worker script loaded');

// Listen for initialization message from main thread
self.addEventListener('message', function(event) {
  console.log('HDW [firebase-messaging-sw.js] Received message:', event.data);

  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('HDW [firebase-messaging-sw.js] Initializing Firebase with config');

    try {
      // Initialize Firebase with the received config
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();
      isInitialized = true;

      console.log('HDW [firebase-messaging-sw.js] Firebase initialized successfully');

      // Set up background message handler
      messaging.onBackgroundMessage(function(payload) {
        console.log('HDW [firebase-messaging-sw.js] Received background message:', payload);

        // Send message back to main thread for additional logging
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'BACKGROUND_MESSAGE_RECEIVED',
              payload: payload
            });
          });
        });

        // Show notification
        const notificationTitle = payload.notification?.title || 'New Message';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new message',
          icon: '/icons/icon-192.png'
        };

        console.log('HDW [firebase-messaging-sw.js] Showing notification:', notificationTitle);
        return self.registration.showNotification(notificationTitle, notificationOptions);
      });

    } catch (error) {
      console.error('HDW [firebase-messaging-sw.js] Error initializing Firebase:', error);
    }
  }

  if (event.data && event.data.type === 'TRANSLATIONS_JSON') {
    translationsMap = event.data.data;
    console.log('HDW [firebase-messaging-sw.js] Updated translationsJson:', translationsMap);
  }
});
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
// Add install and activate event listeners
self.addEventListener('install', function(event) {
  console.log('HDW [firebase-messaging-sw.js] Service worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('HDW [firebase-messaging-sw.js] Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Add push event listener for additional debugging
self.addEventListener('push', function(event) {
  console.log('HDW [firebase-messaging-sw.js] Push event received:', event);

  if (!isInitialized) {
    console.warn('HDW [firebase-messaging-sw.js] Firebase not initialized, cannot handle push');
    return;
  }

  // This will be handled by messaging.onBackgroundMessage, but good to log here too
  console.log('HDW [firebase-messaging-sw.js] Push data:', event.data ? event.data.text() : 'No data');
});
