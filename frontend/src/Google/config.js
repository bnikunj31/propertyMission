// Import Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaMD68rCTEbtnpAbCu1RLVQhQ6vhU64L8",
  
  authDomain: "propertymission-af695.firebaseapp.com",
  projectId: "propertymission-af695",
  storageBucket: "propertymission-af695.firebasestorage.app",
  messagingSenderId: "379537366404",
  appId: "1:379537366404:web:85bda26ee30ecdc7f511d1",
  measurementId: "G-SXSTHWCD6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Corrected initialization
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, provider };
