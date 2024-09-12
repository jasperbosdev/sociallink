// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAUA36iuVVEBJTIZsGo-rbZJ44RYuFFx8",
  authDomain: "sociallink-c1f8b.firebaseapp.com",
  projectId: "sociallink-c1f8b",
  storageBucket: "sociallink-c1f8b.appspot.com",
  messagingSenderId: "275436385244",
  appId: "1:275436385244:web:3b9222e3de3b66fdcdd519"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app }