importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyB55zYPWfACHCgkfkx3VvkGVflfobRg2PU",
    authDomain: "roadmap-6ffb7.firebaseapp.com",
    projectId: "roadmap-6ffb7",
    storageBucket: "roadmap-6ffb7.firebasestorage.app",
    messagingSenderId: "357357517839",
    appId: "1:357357517839:web:281a61b187e7d4befdb77a",
    measurementId: "G-XXQ2VLQP2V"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
});

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
    const { title, body } = payload.notification;
    self.registration.showNotification(title, notificationOptions)
  });
  

