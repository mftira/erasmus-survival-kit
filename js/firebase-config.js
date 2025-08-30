// Firebase Configuration
// This file should contain your actual Firebase config
// For security, the real config will be loaded from a separate file

// Placeholder config - replace with your actual values in firebase-config-actual.js
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseServices = {
    auth,
    db
};
