// Firebase Configuration for GitHub Pages Deployment
// This version contains the actual config for production use

const firebaseConfig = {
    apiKey: "AIzaSyC_J1-nBX26-z4KaYm83LXmoISgSci8dOI",
    authDomain: "erasmus-survival-kit.firebaseapp.com",
    projectId: "erasmus-survival-kit",
    storageBucket: "erasmus-survival-kit.firebasestorage.app",
    messagingSenderId: "178341254086",
    appId: "1:178341254086:web:fdd00fbaf5bb3d71ce18c7"
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
