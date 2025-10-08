// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAHRdYjEG3k1JzYR7OW31bLfC71qi0UNCY",
  authDomain: "skywalker-notification.firebaseapp.com",
  projectId: "skywalker-notification",
  storageBucket: "skywalker-notification.appspot.com",
  messagingSenderId: "624087602629",
  appId: "1:624087602629:web:e0bd6c7aaef5ccea2c27ac",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);
  const title = payload?.notification?.title || "New Message";
  const options = {
    body: payload?.notification?.body || "",
    icon: payload?.notification?.icon || "/icon.png",
  };
  self.registration.showNotification(title, options);
});
