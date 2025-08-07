// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxuFhfuQfIxRShxt4Ook5YNkxsLixMk4Q",
  authDomain: "codebuddy-5a91d.firebaseapp.com",
  projectId: "codebuddy-5a91d",
  storageBucket: "codebuddy-5a91d.firebasestorage.app",
  messagingSenderId: "203792034906",
  appId: "1:203792034906:web:3a311d340dfea6489d3c63",
  measurementId: "G-ZZBH1V12MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth object to use in your authentication code
export const auth = getAuth(app);