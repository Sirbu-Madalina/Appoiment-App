import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID 
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);  // Export this for use in other components



export { db };

// Create and mount the Vue app
const app = createApp(App);
app.use(router);
app.mount('#app');
