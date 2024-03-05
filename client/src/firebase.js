// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "anubhav-real-estate.firebaseapp.com",
  projectId: "anubhav-real-estate",
  storageBucket: "anubhav-real-estate.appspot.com",
  messagingSenderId: "561917256258",
  appId: "1:561917256258:web:2ec44017fbbfddd22c43db"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);