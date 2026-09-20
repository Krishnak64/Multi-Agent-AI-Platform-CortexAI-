// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-5455d.firebaseapp.com",
  projectId: "cortexai-5455d",
  storageBucket: "cortexai-5455d.firebasestorage.app",
  messagingSenderId: "98344312536",
  appId: "1:98344312536:web:522a02e7b371c191e281ad",
  measurementId: "G-GDPFE17277"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()